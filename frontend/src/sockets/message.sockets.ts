import type { IMessage } from "@/types/message.types";
import type { TalketeerSocket } from "@/types/socket.types";
import { QueryClient } from "@tanstack/react-query";

export function startListeningMessageEvents(socket: TalketeerSocket, queryClient?: QueryClient) {
    stopListeningMessageEvents(socket);

    socket.on('newMessage', (roomId, userId, message) => {
        console.log(`Received new message from ${userId}: ${message.content}`);

        const oldMessagePages = queryClient?.getQueryData<{ pages: { success: true, data: { messages: IMessage[], nextCursor: string | null } }[], pageParams: string[] }>(['messages', roomId]);
        if (!oldMessagePages)
            return;

        const newMessagePages = structuredClone(oldMessagePages);
        newMessagePages.pages[0].data.messages.push(message);

        queryClient?.setQueryData(['messages', roomId], newMessagePages)
    });

    socket.on('messageEdited', (roomId, userId, oldMessage, newMessage) => {
        console.log(`${userId} edited their message in room ${roomId} from '${oldMessage}' to '${newMessage}'`);
    });

    socket.on('messageDeleted', (roomId, userId, deletedBy, message) => {
        if (userId === deletedBy)
            return console.log(`${deletedBy} has deleted their message from room ${roomId}: ${message}`)

        console.log(`${deletedBy} has deleted ${userId}'s message: ${message}`);
    });
}

export function stopListeningMessageEvents(socket: TalketeerSocket) {
    socket.off('newMessage')
    socket.off('messageEdited')
    socket.off('messageDeleted')
}