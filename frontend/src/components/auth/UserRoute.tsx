import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery'
import { Navigate, Outlet } from 'react-router-dom';

export const UserRoute = () => {
    const { data, isLoading } = useGetMeQuery({ queryKey: ['users', 'me'] });

    if (isLoading)
        return (<h1>Loading...</h1>)

    if (data?.data?.user)
        return (<Outlet />)

    return (
        <Navigate to='/auth' />
    )
}
