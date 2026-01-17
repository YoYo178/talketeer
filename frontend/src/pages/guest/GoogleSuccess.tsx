import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This page is shown after Google OAuth success, you can fetch user info or tokens if needed
export default function GoogleSuccessPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Optionally, fetch user info or tokens from cookies/localStorage
        // For now, just redirect to chat after a short delay
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
