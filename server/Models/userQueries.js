const db = require('../Models/config/db');
const db1 = require('../Models/config/knexConfig');

const getUserByIdQuery = `
    SELECT * FROM users 
    WHERE 
        is_deleted = false
        AND user_id = $1`;

const deleteUserQuery = `
    UPDATE users 
    SET 
        is_deleted = true 
    WHERE 
        user_id = $1`;


const updateUser = async (user_id, userData) => {
    try {
        const result = await db1('users')
            .where('user_id', user_id)
            .update(userData)
            .returning('*');

        return result[0];
    } catch (error) {
        throw error;
    }
};

const getBookingOfUser = async (user_id) => {
    try {
        const result = await db1('booking')
            .where('user_id', user_id)
            .where('is_shown', true)
            .select(
                'book_id',
                'phone',
                'room_preference',
                'adults',
                'children',
                'user_id',
                'accommodation_id',
                'packages_id'
            );
        return result;
    } catch (error) {
        throw error;
    }
};
const getFlightsOfUser = async (user_id) => {
    try {
        const result = await db1('ticketbooking')
            .where('ticketbooking.user_id', user_id)
            .where('ticketbooking.is_shown', true)
            .select(
                'ticketbooking.ticket_id',
                'ticketbooking.ticket_type',
                'ticketbooking.cost',
                'ticketbooking.user_id',
                'ticketbooking.flights_id',
                'flights.depart_date',
                'flights.return_date'
            )
            .join('flights', 'ticketbooking.flights_id', 'flights.flights_id');

        return result;
    } catch (error) {
        throw error;
    }
};
const CancelTicket = async (ticket_id) => {
    try {
        return await db1('ticketbooking')
            .where({ ticket_id: ticket_id })
            .update({ is_shown: false })
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error Cancel Ticket');
    }
};

const getUserPaginated = async (page, pageSize, search) => {
    try {
        if (page <= 0 || pageSize <= 0) {
            throw new Error("Invalid page or pageSize");
        }

        const offset = (page - 1) * pageSize;

        let query = db1('users')
            .orderBy('first_name', 'asc')
            .where('is_deleted', false)
            .limit(pageSize)
            .offset(offset);

        if (search) {
            query = query.whereRaw('LOWER(first_name) LIKE ?', `%${search.toLowerCase()}%`);
        }

        // Subquery to get total count
        const totalCountQuery = db1('users')
            .count('* as count')
            .where('is_deleted', false);

        if (search) {
            totalCountQuery.whereRaw('LOWER(first_name) LIKE ?', `%${search.toLowerCase()}%`);
        }

        const totalCountResult = await totalCountQuery.first();

        return { data: await query, totalCount: totalCountResult.count };
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching paginated Users');
    }
};


module.exports = {
    getUserByIdQuery,

    updateUser,
    
    deleteUserQuery,

    getBookingOfUser,

    getFlightsOfUser,

    CancelTicket,

    getUserPaginated
};
