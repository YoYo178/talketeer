import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component handles the Google OAuth success redirect
// It checks for authentication cookies and redirects to /chat if found
export const GoogleSuccessPage = () => {
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        // Check for accessToken and refreshToken cookies
        const hasToken = document.cookie.includes('accessToken') && document.cookie.includes('refreshToken');
        if (hasToken) {
            const timer = setTimeout(() => {
                navigate('/chat');
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setError('Login failed: No authentication token found. Please try again.');
        }
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {error ? (
                <>
                    <h2 className="text-xl font-bold mb-4 text-red-600">Google Login Failed</h2>
                    <p className="text-red-500">{error}</p>
                </>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-4">Google Login Successful!</h2>
                    <p>Redirecting to chat...</p>
                </>
            )}
        </div>
    );
}
