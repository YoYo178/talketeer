import { CheckEmailForm } from '@/components/auth/CheckEmailForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useQueryClient } from '@tanstack/react-query'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const handleCheckEmailSuccess = (userExists: boolean, isVerified: boolean) => {
        if (!userExists) {
            navigate('/auth/signup');
            return;
        }

        if (isVerified)
            navigate('/auth/login');
        else
            navigate('/auth/verify');
    }

    const handleLoginSuccess = (isVerified: boolean) => {
        if (!isVerified) {
            navigate('/auth/verify');
            return;
        }

        queryClient.invalidateQueries({ queryKey: ['users'] });
        navigate('/chat')
    }

    const handleSignupSuccess = () => {
        navigate('/auth/verify');
    }

    const getRender = () => {
        switch (location.pathname) {
            case '/auth':
            case '/auth/':
                return (<CheckEmailForm onActionSuccess={handleCheckEmailSuccess} />)

            case '/auth/login':
            case '/auth/login/':
                return (<LoginForm onActionSuccess={handleLoginSuccess} />)

            case '/auth/signup':
            case '/auth/signup/':
                return (<SignupForm onActionSuccess={handleSignupSuccess} />)

            default:
                return (<Outlet />)
        }
    }

    return (
        <div className='bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
            <div className='w-full max-w-sm'>
                {getRender()}
            </div>
        </div>
    )
}
