import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const UserRoute = () => {
    const { data, isLoading, error } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const [isLoggedIn, setIsLoggedIn] = useState(!!data?.data.user._id);

    useEffect(() => {
        setIsLoggedIn(!!data?.data.user._id);
    }, [data?.data.user._id]);

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
