import React, { useState, type FC } from 'react'
import { AxiosError } from 'axios';
import { MessagesSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import z from 'zod';
import { useCheckEmailMutation } from '@/hooks/network/auth/useCheckEmailMutation';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '@/hooks/state/useAuthStore';
// ...existing import statements...
import { TooltipTrigger } from '../ui/tooltip';
import { getFooter } from '@/utils/misc.utils';
import { API_URL } from '@/config/api.config';

// Google OAuth handler
const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
}

interface CheckEmailFormProps {
    onActionSuccess: (userExists: boolean, isVerified: boolean, userId?: string) => void;
}

const emailSchema = z.object({
    email: z.email('Please enter a valid email address')
})

export const CheckEmailForm: FC<CheckEmailFormProps> = ({ onActionSuccess }) => {
    const { email, setEmail } = useAuthStore();
    const [error, setError] = useState('');

    const checkEmailMutation = useCheckEmailMutation({ queryKey: ['auth', 'check-email'] });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const validatedData = emailSchema.safeParse({ email: email.trim() })

            // Check if user exists
            if (validatedData.success) {
                await checkEmailMutation.mutateAsync({
                    payload: { ...validatedData.data }
                })

                onActionSuccess(true, true)
            } else
                setError(validatedData.error.issues[0].message);
        } catch (error) {
            if (error instanceof AxiosError) {
                // Here, we expect a 401 (User not verified) OR a 404 (User simply doesn't exist) from the backend
                if (!error.response?.data?.success) {
                    if (error.response?.status === 401) {
                        onActionSuccess(true, false, error.response.data?.data.user._id)
                    } else if (error.response?.status === 404) {
                        onActionSuccess(false, false)
                    } else {
                        // We have an unexpected error
                        const response = error.response?.data;
                        const errorMessage = response?.message || 'Something went wrong. Please try again.'
                        setError(errorMessage)
                    }
                }
            } else {
                setError('Something went wrong. Please try again.')
            }
        }
    }

    return (
        <div className={'flex flex-col gap-6'}>
            <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center gap-2'>
                    <Link
                        to='/'
                        className='flex flex-col items-center gap-2 font-medium'
                    >
                        <Button className='flex size-8 items-center justify-center rounded-md bg-transparent text-primary hover:bg-primary-foreground'>
                            <MessagesSquare className='size-6' />
                        </Button>
                        <span className='sr-only'>Talketeer</span>
                    </Link>
                    <h1 className='text-xl font-bold'>Welcome to Talketeer</h1>
                    <div className='text-center text-sm'>
                        Enter your email to get started
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-6'>
                        <div className='grid gap-3'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='m@example.com'
                                autoComplete='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={error ? 'border-red-500' : ''}
                                required
                            />
                            {error && (
                                <p className='text-sm text-red-500'>{error}</p>
                            )}
                        </div>
                        <Button type='submit' className='w-full' disabled={checkEmailMutation.isPending}>
                            {checkEmailMutation.isPending ? 'Please wait...' : 'Continue'}
                        </Button>
                    </div>
                </form>

                <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                    <span className='bg-background text-muted-foreground relative z-10 px-2'>
                        Or
                    </span>
                </div>

                <TooltipTrigger asChild>
                    <Button variant='outline' type='button' className='w-full' onClick={handleGoogleLogin}>
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                            <path
                                d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                                fill='currentColor'
                            />
                        </svg>
                        Continue with Google
                    </Button>
                </TooltipTrigger>

            </div>

            <div className='flex flex-col gap-1 text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
                {getFooter()}
            </div>
        </div>
    )
}
