import { Button } from '@/components/ui/button';
import { getFooter } from '@/utils/misc.utils';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4'>
            <h1 className='text-4xl md:text-5xl font-bold text-center mb-4 mt-auto'>
                Welcome to Talketeer
            </h1>
            <p className='text-muted-foreground text-center max-w-md mb-8'>
                Real-time chat made simple. Connect with friends, join rooms, and share your thoughts instantly.
            </p>
            <Button size='lg' className='px-8 text-lg cursor-pointer' onClick={() => navigate('/auth')}>
                Get Started
            </Button>
            <div className='mt-auto mb-8 flex flex-col gap-1 text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
                {getFooter()}
            </div>
        </div>
    );
};