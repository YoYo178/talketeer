import type { IMessage } from "@/types/message.types";
import type { IRoom } from "@/types/room.types";
import { QueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";

export function startListeningMessageEvents(socket: Socket, queryClient?: QueryClient) {
    stopListeningMessageEvents(socket);

    socket.on('newMessage', (roomId: string, userId: string, message: string, rawMessage?: IMessage) => {
        if (rawMessage) {
            queryClient?.setQueryData(['rooms', roomId], (old: { data: { room: IRoom } }) => {
                if (!old) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        room: {
                            ...old.data.room,
                            messages: [...old.data.room.messages, rawMessage]
                        }
                    }
                };
            })
        }
        console.log(`Received new message from ${userId}: ${message}`);
    });

    socket.on('messageEdited', (roomId: string, userId: string, oldMessage: string, newMessage: string) => {
        console.log(`${userId} edited their message in room ${roomId} from '${oldMessage}' to '${newMessage}'`);
    });

    socket.on('messageDeleted', (roomId: string, userId: string, deletedBy: string, message: string) => {
        if (userId === deletedBy)
            return console.log(`${deletedBy} has deleted their message from room ${roomId}: ${message}`)

        console.log(`${deletedBy} has deleted ${userId}'s message: ${message}`);
    });
}

export function stopListeningMessageEvents(socket: Socket) {
    socket.off('newMessage')
    socket.off('messageEdited')
    socket.off('messageDeleted')
}