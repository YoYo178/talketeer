import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const GuestRoute = () => {
    const { data, isLoading, error } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const [isLoggedIn, setIsLoggedIn] = useState(!!data?.data.user._id);

    useEffect(() => {
        setIsLoggedIn(!!data?.data.user._id);
    }, [data?.data.user._id]);

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
