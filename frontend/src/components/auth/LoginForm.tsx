import { MessagesSquare, ArrowLeft } from 'lucide-react'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useEffect, useState, type FC } from 'react'
import { useLoginMutation } from '@/hooks/network/auth/useLoginMutation'
import { AxiosError } from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/hooks/state/useAuthStore'
import { getFooter } from '@/utils/misc.utils'

interface LoginFormProps {
    onActionSuccess: (isVerified: boolean) => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onActionSuccess }) => {
    const navigate = useNavigate();
    const loginMutation = useLoginMutation({ queryKey: ['auth', 'login'] })

    const { email, setEmail } = useAuthStore();
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!email.length)
            navigate('/auth')
    }, [email])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        try {
            if (!password?.length) {
                setError('Password is required!')
                return;
            }

            await loginMutation.mutateAsync({
                payload: { email, password }
            })

            onActionSuccess(true);
        } catch (error) {
            if (error instanceof AxiosError) {
                // Here, we expect 3 errors from the backend:
                // - A '400 Bad Request' signifies that the user entered invalid password or the fields are malformed
                // - A '401 Unauthorized' signifies that the user exists but is not verified yet, this is highly unlikely to be triggered since the check email
                //   form should handle it on its own
                // - A '404 Not Found' signifies that there is no user associated with this email (highly unlikely with the current flow of the application)
                if (!error.response?.data?.success) {
                    if (error.response?.status === 401) {
                        onActionSuccess(false)
                        return;
                    }

                    setError(error.response?.data?.message || 'Invalid email or password');
                }
            } else {
                setError('Something went wrong. Please try again.')
            }
        }
    }

    return (
        <div className='flex flex-col gap-6'>
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
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-2'>
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => setEmail('')}
                                className='p-1 h-auto'
                            >
                                <ArrowLeft className='size-4' />
                            </Button>
                            <span className='text-sm text-muted-foreground'>
                                Welcome back! Please enter your password.
                            </span>
                        </div>
                        <div className='flex flex-col gap-1 my-4'>

                            <div className='grid gap-3'>
                                <Label htmlFor='login-password'>Password</Label>
                                <Input
                                    id='password'
                                    type='password'
                                    placeholder='Enter your password'
                                    autoComplete='off'
                                    value={password}
                                    onChange={(e) => { setError(''); setPassword(e.target.value) }}
                                    className={error ? 'border-red-500' : ''}
                                    required
                                />
                                {error && (
                                    <p className='text-sm text-red-500'>{error}</p>
                                )}
                            </div>

                            <Link to='/auth/reset' className='text-sm text-muted-foreground underline self-end'>Forgot password?</Link>
                        </div>
                        <Button
                            type='submit'
                            className='w-full'
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? 'Logging in...' : 'Login'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
                {getFooter()}
            </div>
        </div>
    )
}
