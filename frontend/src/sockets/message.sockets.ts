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

        // Invalidate the messages query to refetch updated data
        queryClient?.invalidateQueries({ queryKey: ['messages', roomId] });
    });

    socket.on('messageDeleted', (roomId, userId, deletedBy, messageId) => {
        if (userId === deletedBy)
            console.log(`${deletedBy} has deleted their message from room ${roomId}: ${messageId}`)
        else
            console.log(`${deletedBy} has deleted ${userId}'s message: ${messageId}`);

        // Mark the message as deleted in the cache (don't show content)
        const oldMessagePages = queryClient?.getQueryData<{ pages: { success: true, data: { messages: IMessage[], nextCursor: string | null } }[], pageParams: string[] }>(['messages', roomId]);
        if (!oldMessagePages)
            return;

        const newMessagePages = structuredClone(oldMessagePages);
        
        // Mark the message as deleted (backend won't send content)
        newMessagePages.pages.forEach(page => {
            page.data.messages.forEach(msg => {
                if (msg._id === messageId) {
                    msg.isDeleted = true;
                    msg.deletedAt = new Date().toISOString();
                    msg.content = ''; // Clear content for privacy
                }
            });
        });

        queryClient?.setQueryData(['messages', roomId], newMessagePages);
    });
}

export function stopListeningMessageEvents(socket: TalketeerSocket) {
    socket.off('newMessage')
    socket.off('messageEdited')
    socket.off('messageDeleted')
}