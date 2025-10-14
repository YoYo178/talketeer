import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4'>
            <h1 className='text-4xl md:text-5xl font-bold text-center mb-4'>
                Welcome to Talketeer
            </h1>
            <p className='text-muted-foreground text-center max-w-md mb-8'>
                Real-time chat made simple. Connect with friends, join rooms, and share your thoughts instantly.
            </p>
            <Button size='lg' className='px-8 text-lg cursor-pointer' onClick={() => navigate('/auth')}>
                Get Started
            </Button>
        </div>
    );
};