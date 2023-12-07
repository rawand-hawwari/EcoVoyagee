// const db = require('./config/db');
const db = require('./config/knexConfig');

const getPackages = async () => {
    try {
        return await db
            .select('*')
            .from('packages')
            .where({
                is_deleted: false,
            })
        // .orderBy('titile', 'desc') // Assuming 'created_at' is the timestamp for when the accommodation was created
        // .limit(5);
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching packages');
    }
};

const getPackagesById = async (packages_id) => {
    try {
        return await db('packages')
            .select('*')
            .where({
                is_deleted: false,
                packages_id: packages_id
            });
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching packages by ID');
    }
};

const addPackages = async (packagesData) => {
    try {
        return await db('packages')
            .insert(packagesData)
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error adding packages');
    }
};

const updatePackages = async (packages_id, packagesData) => {
    try {
        return await db('packages')
            .where({ packages_id: packages_id })
            .update(packagesData)
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error updating packages');
    }
};

const markPackagesAsDeleted = async (packages_id) => {
    try {
        return await db('packages')
            .where({ packages_id: packages_id })
            .update({ is_deleted: true });
    } catch (err) {
        console.error(err);
        throw new Error('Error marking packages as deleted');
    }
};


const addCommentPac = async (packages_id, user_id, comment_text) => {
    try {
        const packagesResult = await db('packages')
            .where({ packages_id: packages_id, is_deleted: false })
            .first();

        if (!packagesResult) {
            throw new Error('packages not found or deleted');
        }

        const userResult = await db('users')
            .where({ user_id: user_id })
            .first();

        if (!userResult) {
            throw new Error('User not found');
        }

        return await db('comments')
            .insert({
                packages_id: packages_id,
                user_id: user_id,
                comment_text: comment_text
            })
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error adding comment');
    }
};
const getPackagesWithComments = async (packages_id) => {
    try {
        return await db('packages')
            .where('packages.is_deleted', false)
            .where('packages.packages_id', packages_id)
            .join('comments', 'packages.packages_id', '=', 'comments.packages_id')
            .join('users', 'comments.user_id', '=', 'users.user_id')
            .select(
                'packages.packages_id',
                'comments.comment_id',
                'comments.comment_text',
                'comments.timestamp as comment_timestamp',
                'users.user_id',
                'users.first_name',
                'users.last_name'
            );
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching packages with comments');
    }
};

const BookPackage = async (packages_id, user_id, address, phone, room_preference, cost, adults, children, date_from, date_to) => {
    try {
        return await db('booking')
            .insert({
                packages_id: packages_id,
                user_id: user_id,
                address: address,
                phone: phone,
                room_preference: room_preference,
                cost: cost,
                adults: adults,
                children: children,
                date_from:date_from, 
                date_to:date_to,
                is_shown : true
            })
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error booking packages');
    }
};


const getBookPackages = async (packages_id) => {
    try {
        return await db('packages')
            .where('packages.is_deleted', false)
            .where('packages.packages_id', packages_id)
            .join('booking', 'packages.packages_id', '=', 'booking.packages_id')
            .join('users', 'booking.user_id', '=', 'users.user_id')
            .select(
                'packages.packages_id',
                'booking.book_id',
                'booking.phone',
                'booking.room_preference',
                'booking.adults',
                'booking.children',
                'users.user_id',
                'users.first_name',
                'users.last_name'
            );
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching booked packages');
    }
};


const getPackagesPaginated = async (page, pageSize) => {
    try {
        const offset = (page - 1) * pageSize;
        return await db('packages')
            .orderBy('title', 'asc')
            .where('is_deleted', false)
            .limit(pageSize)
            .offset(offset);
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching paginated packages');
    }
};

module.exports = {

    getPackages,

    getPackagesById,

    addPackages,

    updatePackages,

    markPackagesAsDeleted,

    addCommentPac,

    getPackagesWithComments,

    BookPackage,

    getBookPackages,

    // getBookByIdQuery,

    getPackagesPaginated

};
