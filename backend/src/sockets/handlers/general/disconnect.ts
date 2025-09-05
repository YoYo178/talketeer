import { Room, User } from "@src/models";
import { TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";

export const getDisconnectEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (reason: string, description: string) => {
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
    }
}