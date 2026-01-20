import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component handles the Google OAuth success redirect
export const GoogleSuccessPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to chat after a short delay
        const timer = setTimeout(() => {
            navigate('/chat');
        }, 1000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-xl font-bold mb-4">Google Login Successful!</h2>
            <p>Redirecting to chat...</p>
        </div>
    );
}
