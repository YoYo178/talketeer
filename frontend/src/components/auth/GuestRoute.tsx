import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const GuestRoute = () => {
    const { data, isLoading, error } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const me = data?.data?.user;

    const [isLoggedIn, setIsLoggedIn] = useState(!!me?._id);

    useEffect(() => {
        setIsLoggedIn(!!me?._id);
    }, [me?._id]);

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
