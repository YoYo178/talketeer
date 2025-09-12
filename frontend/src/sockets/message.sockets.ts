import type { IMessage } from "@/types/message.types";
import { QueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";

export function startListeningMessageEvents(socket: Socket, queryClient?: QueryClient) {
    stopListeningMessageEvents(socket);

    socket.on('newMessage', (roomId: string, userId: string, message: IMessage) => {
        console.log(`Received new message from ${userId}: ${message.content}`);

        const oldMessagePages = queryClient?.getQueryData<{ pages: { success: true, data: { messages: IMessage[], nextCursor: string | null } }[], pageParams: string[] }>(['messages', roomId]);
        if (!oldMessagePages)
            return;

        const newMessagePages = structuredClone(oldMessagePages);
        newMessagePages.pages[0].data.messages.push(message);

        queryClient?.setQueryData(['messages', roomId], newMessagePages)
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