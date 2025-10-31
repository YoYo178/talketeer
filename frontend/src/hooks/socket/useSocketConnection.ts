import { socket } from '@/socket';
import { handleSocketConnection, handleSocketDisconnection } from '@/sockets/general.sockets';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export const useSocketConnection = () => {
    const queryClient = useQueryClient();
    const isConnectedRef = useRef(false);

    useEffect(() => {
        // Only connect if not already connected
        if (!isConnectedRef.current && !socket.connected) {
            console.log('Connecting to socket...');
            socket.connect();
            handleSocketConnection(socket, queryClient);
            isConnectedRef.current = true;
        }

        // Cleanup on unmount
        return () => {
            if (isConnectedRef.current && socket.connected) {
                console.log('Disconnecting from socket...');
                handleSocketDisconnection(socket);
                socket.disconnect();
                isConnectedRef.current = false;
            }
        };
    }, [queryClient]);

    return { socket, isConnected: socket.connected };
};
