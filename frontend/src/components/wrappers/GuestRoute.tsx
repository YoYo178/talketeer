import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery';
import { Navigate, Outlet } from 'react-router-dom';
import { Loading } from '../Loading';

export const GuestRoute = () => {
    const { data, isLoading, error } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const me = data?.data?.user;
    const isLoggedIn = !!me?._id;

    if (isLoading)
        return (<Loading />)

    if (error)
        return (<Outlet />)

    if (isLoggedIn)
        return (<Navigate to='/chat' />)

    return (
        <Outlet />
    )
}
