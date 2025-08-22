import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery';
import { socket } from '@/socket';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const GuestRoute = () => {
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
        return (<Outlet />)

    if (isLoading)
        return (<h1>Loading...</h1>)

    if (isLoggedIn)
        return (<Navigate to='/chat' />)

    return (
        <Outlet />
    )
}
