const db = require('./config/knexConfig');

const addRoom = async (roomData) => {
    try {
        return await db('rooms')
            .insert(roomData)
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error adding room');
    }
};


const getRooms = async () => {
    const trx = await db.transaction(); // Start a transaction

    try {
        // const now = new Date(); // Current date and time

        const rooms = await trx
            .select('*')
            .from('room_booking2')
        // .where({
        //     is_deleted: false,
        // });

        // await Promise.all(
        //     rooms.map(async (room) => {
        //         if (now > new Date(room.date_to) && now < new Date(room.newdate_from)) {
        //             // Replace date_from and date_to with newdate_from and newdate_to
        //             await trx('rooms')
        //                 .where('room_id', room.room_id)
        //                 .update({
        //                     date_from: room.newdate_from,
        //                     date_to: room.newdate_to,
        //                 });
        //         }
        //     })
        // );

        // // Commit the transaction
        // await trx.commit();

        // // Fetch the updated rooms after the update
        // const updatedRooms = await db
        //     .select('*')
        //     .from('rooms')
        //     .where({
        //         is_deleted: false,
        //     });

        return rooms;
    } catch (err) {
        // Rollback the transaction in case of an error
        await trx.rollback();
        console.error(err);
        throw new Error('Error fetching and updating rooms');
    }
};


// const getFilteredRooms = async (date_from, date_to) => {
//     try {
//         const result = await db.raw(`
//             SELECT *
//             FROM room_booking2
//             WHERE (
//                 date_to < ? OR date_from > ?
//             )
//         `, [date_from, date_to]);

//         return result.rows;
//     } catch (err) {
//         console.error(err);
//         throw new Error('Error filtering rooms: ' + err.message);
//     }
// };


const getFilteredRooms = async (accommodation_id, date_from, date_to) => {
    try {
        const result = await db('room_booking2')
            .select('*')
            .join('rooms', 'room_booking2.room_id', 'rooms.room_id')
            .where('rooms.accommodation_id', accommodation_id)
            .andWhere(function () {
                this.where('room_booking2.date_to', '<', date_from)
                    .orWhere('room_booking2.date_from', '>', date_to);
            });

        // const query = db('room_booking2')
        //     .select('*')
        //     .where(function () {
        //         this.where('date_to', '>=', date_from)
        //             .andWhere('date_from', '<=', date_to);
        //     });

        // console.log(query.toSQL());

        return result;
    } catch (err) {
        console.error(err);
        throw new Error('Error filtering rooms: ' + err.message);
    }
};


const BookRoom = async (user_id, room_id, accommodation_id, date_from, date_to) => {
    try {

        const isRoomAvailable = await getFilteredRooms(accommodation_id, date_from, date_to);

        console.log('Filtered Rooms:', isRoomAvailable);

        if (isRoomAvailable.length === 0) {
            // Room is available, proceed with the booking
            const bookingResult = await db('room_booking2').insert({
                room_id: room_id,
                user_id: user_id,
                date_from: date_from,
                date_to: date_to,
                // Add other booking details as needed
            });

            return bookingResult;
        } else {
            // Room is not available for the specified dates
            throw new Error('Room is not available for the specified dates.');
        }
    } catch (err) {
        console.error(err);
        throw new Error('Error booking room: ' + err.message);
    }
};


module.exports = {
    addRoom,

    BookRoom,

    getFilteredRooms,

    getRooms
}