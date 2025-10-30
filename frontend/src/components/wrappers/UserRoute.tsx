import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery';
import { Navigate, Outlet } from 'react-router-dom';
import { Loading } from '../Loading';

export const UserRoute = () => {
    const { data, isLoading, error } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const me = data?.data?.user;
    const isLoggedIn = !!me?._id;

    if (isLoading)
        return (<Loading />)

    if (error)
        return (<Navigate to='/auth' />)

    if (isLoggedIn)
        return (<Outlet />)

    return (
        <Navigate to='/auth' />
    )
}
