import { CheckEmailForm } from '@/components/auth/CheckEmailForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const [email, setEmail] = useState('');

    const handleCheckEmailSuccess = (userExists: boolean, isVerified: boolean) => {
        if (!userExists) {
            navigate('/auth/signup');
            return;
        }

        if (isVerified)
            navigate('/auth/login');

        // TODO: Redirect to verification page if not verified
    }

    const handleLoginSuccess = (isVerified: boolean) => {
        if (!isVerified) {
            // TODO: Redirect to verification page
            return;
        }

        queryClient.invalidateQueries({ queryKey: ['users'] });
        navigate('/chat')
    }

    const handleSignupSuccess = () => {
        // TODO: Redirect to verification page
    }

    const getRender = () => {
        switch (location.pathname) {
            case '/auth':
            case '/auth/':
                return (<CheckEmailForm email={email} onEmailChange={setEmail} onActionSuccess={handleCheckEmailSuccess} />)

            case '/auth/login':
            case '/auth/login/':
                return (<LoginForm email={email} onEmailChange={setEmail} onActionSuccess={handleLoginSuccess} />)

            case '/auth/signup':
            case '/auth/signup/':
                return (<SignupForm email={email} onEmailChange={setEmail} onActionSuccess={handleSignupSuccess} />)

            default:
                return (<Outlet />)
        }
    }

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                {getRender()}
            </div>
        </div>
    )
}
