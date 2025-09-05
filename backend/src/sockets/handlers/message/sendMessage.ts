import { Message, Room } from "@src/models";
import { TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";
import { AckFunc } from "@src/types/socket.types";

export const getSendMessageEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (roomId: string, messageContent: string, ack: AckFunc) => {
        try {
            const room = await Room.findById(roomId);

            if (!room)
                return;

            const message = await Message.create({
                content: messageContent,
                sender: socket.data.user.id
            })

            room.messages.push(message._id.toString());
            await room.save();

            console.log(`${socket.data.user.username} sent message: ${messageContent}`)
            io.to(roomId).emit('newMessage', roomId, socket.data.user.id, messageContent, message.toObject());
            ack(true);
        } catch (err) {
            ack(false)
        }
    }
}