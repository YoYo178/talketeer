import { Room, User } from '@src/models';
import { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types';

export function registerGeneralHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
    socket.on('disconnect', async (reason, description) => {
        console.log(`${socket.data.user.username} disconnected`);

        const user = await User.findById(socket.data.user.id);
        if (!user?.room) return;

        await User.updateOne(
            { _id: user._id },
            {
                room: null
            }
        )

        await Room.updateOne(
            { _id: user.room },
            {
                $pull: { members: { user: socket.data.user.id } }
            }
        );

        io.emit('roomUpdated', user.room.toString());
    });

    socket.on('disconnecting', (reason, description) => {
        console.log(`${socket.data.user.username} disconnecting`)
    });

    socket.on('error', (err) => {
        console.error(`An error occured for ${socket.id}`);
        console.error(err)
    });
}