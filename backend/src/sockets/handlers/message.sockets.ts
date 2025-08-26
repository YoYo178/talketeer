import { Message, Room } from '@src/models';
import { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types';

export function registerMessageHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
    socket.on('sendMessage', async (roomId, messageContent, ack) => {
        try {
            const room = await Room.findById(roomId);

            if (!room)
                return;

            const message = await Message.create({
                content: messageContent,
                sender: socket.data.user.id
            })

            room.messages.push(message._id);
            await room.save();

            console.log(`${socket.data.user.username} sent message: ${messageContent}`)
            io.to(roomId).emit('newMessage', roomId, socket.data.user.id, messageContent);
            ack(true);
        } catch (err) {
            ack(false)
        }
    });
}