import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery'
import { socket } from '@/socket';
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const UserRoute = () => {
    const { data, isLoading, error } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const [isLoggedIn, setIsLoggedIn] = useState(data?.data?.user);

    useEffect(() => {
        if (data?.data?.user) {
            setIsLoggedIn(true);
            socket.connect();
        } else {
            setIsLoggedIn(false);
            socket.disconnect();
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
