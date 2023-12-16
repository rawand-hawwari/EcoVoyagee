const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
app.use(express.json());
var cors = require('cors');
app.use(cors());


app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const userRouter = require("./routes/user_routes");

const OAuthRouter = require('./routes/OAuth_routes');

const destinations_routes = require('./routes/destinations_routes');

const accommodationRoutes = require('./routes/accommodation-routes');

const activitiesRoutes = require('./routes/activities_routes');

const packagesRoutes = require('./routes/packages-routes');

const contactUsRouter = require('./routes/contactUs_routes');

const flightsRoute = require('./routes/flights-routes');

const statisticsRoute = require('./routes/statistics-routes');

const ticketbooking = require('./routes/ticketbooking-routes');

const stripeRouter = require('./routes/stripe-routes');

app.use(userRouter);

app.use(OAuthRouter);

app.use(destinations_routes);

app.use(accommodationRoutes);

app.use(activitiesRoutes);

app.use(contactUsRouter);

app.use(packagesRoutes);

app.use(flightsRoute);

app.use(statisticsRoute);

app.use(ticketbooking);

app.use(stripeRouter);


const { createServer } = require('node:http');
const { Server } = require('socket.io');
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Replace with your frontend URL
        methods: ["GET", "POST"]
    },
    connectionStateRecovery: {},
});
const db = require('./Models/config/db');

const verifyJWT = require('./Middleware/VerifyJWT'); // Assuming you have a module for JWT verification

// Maintain a mapping of user IDs to their socket IDs
const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('A user connected On Id:', socket.handshake.auth.userSocketId);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        // Remove the user's socket ID from the map upon disconnection
        delete userSocketMap[socket.handshake.auth.user_id];
    });

    if (!socket.recovered) {
        (async () => {
            try {
                const userSocketId = socket.handshake.auth.userSocketId;

                if (!userSocketId) {
                    throw new Error('userSocketId not provided');
                }

                // Create a room for the user
                const userRoom = `user_${userSocketId}`;
                socket.join(userRoom);

                console.log(`User joined room: ${userRoom}`);

                // If you have any specific logic for connection state recovery, you can add it here
                socket.recovered = true;

                // Check if the connected user is an admin (role_id = 2)
                if (socket.handshake.auth.isAdmin) {
                    // Store the admin socket for later use
                    const adminSocketId = socket.id;
                    const adminUserId = socket.handshake.auth.user_id; // Use the admin's user ID
                    userSocketMap[adminUserId] = adminSocketId; // Store user ID instead of admin user ID
                    console.log('Admin connected with socket ID:', adminSocketId);
                } else {
                    // Store the user socket for later use
                    userSocketMap[socket.handshake.auth.user_id] = socket.id;
                    console.log('User connected with socket ID:', socket.id);
                }
            } catch (e) {
                console.error('Error during connection state recovery:', e);
            }
        })();
    }
});

app.post('/chat', verifyJWT.authorize([1, 2]), async (req, res) => {
    const message = req.body.message;
    const user_id = req.user.user_id;
    const role_id = req.user.role_id;

    try {
        console.log(`Received chat message from user ${user_id} with role ${role_id}`);

        if (role_id === 2) {
            // Admin logic
            const adminResponse = req.body.adminResponse;
            console.log('admin response: ', adminResponse);

            // Use the stored user socket ID
            const userSocketId = userSocketMap[user_id];
            if (userSocketId) {
                io.to(`user_${userSocketId}`).emit('chat message', { sender_role: 'admin', content: adminResponse, socket_id: socket.id });
                console.log('Sent chat message to user:', userSocketId);
            } else {
                console.error('User socket not found for admin message');
            }
            await db.query('INSERT INTO socket (adminresponse, user_id, sender_role) VALUES ($1, $2, $3) RETURNING socket_id;', [adminResponse, user_id, 'admin']);

        } else {
            const userSocketId = req.body.userSocketId;

            // Join the admin to the user's room based on user_id
            const adminSocketId = userSocketMap[user_id];
            if (adminSocketId) {
                io.to(`user_${user_id}`).emit('admin joined', { adminSocketId });
                console.log('Admin joined user room:', `user_${user_id}`);
            } else {
                console.error('Admin socket not found for user message');
            }

            const result = await db.query('INSERT INTO socket (userresponse, user_id, sender_role) VALUES ($1, $2, $3) RETURNING socket_id;', [message, user_id, 'user']);

            // Use the stored user socket ID
            if (userSocketId) {
                io.to(`user_${userSocketId}`).emit('chat message', { sender_role: 'user', content: message, socket_id: result.rows[0].socket_id });
                console.log('Sent chat message to admin:', userSocketId);
            } else {
                console.error('User socket not found for user message');
            }
        }

        res.status(200).send('Message received');
    } catch (error) {
        console.error('Error handling chat message:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/previous-messages', verifyJWT.authorize([1, 2]), async (req, res) => {
    const user_id = req.user.user_id;
    const role_id = req.user.role_id;

    try {
        let userMessages = [];

        if (role_id === 2) {
            // Admin logic: Retrieve both user and admin messages
            userMessages = await db.query(`
                SELECT socket.adminresponse AS content, socket.socket_id, users.first_name, users.role_id AS user_role_id, socket.sender_role
                FROM socket
                INNER JOIN users ON socket.user_id = users.user_id
                WHERE socket.user_id = $1 OR (socket.admin_id = $1 AND socket.sender_role = 'user')
            `, [user_id]);
        } else {
            // Common user logic: Retrieve only user messages
            userMessages = await db.query(`
                SELECT socket.userresponse AS content, socket.socket_id, users.first_name, users.role_id AS user_role_id, socket.sender_role
                FROM socket
                INNER JOIN users ON socket.user_id = users.user_id
                WHERE socket.user_id = $1
            `, [user_id]);
        }

        const formattedMessages = userMessages.rows.map(userMessage => ({
            // first_name: userMessage.sender_role === 'admin' ? 'Admin' : 'User',
            first_name: userMessage.sender_role === 'admin' ? 'Admin' : userMessage.first_name,
            content: userMessage.content,
            socket_id: userMessage.socket_id,
        }));

        res.status(200).json({ messages: formattedMessages });
    } catch (error) {
        console.error('Error fetching previous messages:', error);
        res.status(500).send('Internal Server Error');
    }
});



const PORT = process.env.PORT || 3999;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

