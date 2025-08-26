import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery'
import { socket } from '@/socket';
import { handleSocketConnection, handleSocketDisconnection } from '@/sockets/general.sockets';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const UserRoute = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const [isLoggedIn, setIsLoggedIn] = useState(data?.data?.user);

    useEffect(() => {
        if (data?.data?.user) {
            setIsLoggedIn(true);
            if (!socket.connected) {
                socket.connect();
                handleSocketConnection(socket, queryClient);
            }
        } else {
            setIsLoggedIn(false);
            if (socket.connected) {
                socket.disconnect();
                handleSocketDisconnection(socket);
            }
        }
    }, [data])

    if (error)
        return (<Navigate to='/auth' />)

    if (isLoading)
        return (<h1>Loading...</h1>)

    if (isLoggedIn)
        return (<Outlet />)

    return (
        <Navigate to='/auth' />
    )
}
