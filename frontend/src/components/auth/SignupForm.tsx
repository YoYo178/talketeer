import { ArrowLeft, MessagesSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useEffect, type FC } from 'react'
import { AxiosError } from 'axios'
import { useSignupMutation } from '@/hooks/network/auth/useSignupMutation'
import { useForm, type SubmitHandler } from 'react-hook-form'

interface SignupFormProps {
    email: string;
    onEmailChange: (email: string) => void;
    onActionSuccess: () => void;
}

interface SignupFormFields {
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    username: string;
    password: string;
}

export const SignupForm: FC<SignupFormProps> = ({ email, onEmailChange, onActionSuccess }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<SignupFormFields>({
        defaultValues: { email }
    });

    const signupMutation = useSignupMutation({ queryKey: ['auth', 'signup'] })

    useEffect(() => {
        if (!email.length)
            navigate('/auth')
    }, [email])

    const onSubmit: SubmitHandler<SignupFormFields> = async (data: SignupFormFields) => {
        try {
            await signupMutation.mutateAsync({
                payload: {
                    name: `${data.firstName} ${data.lastName}`,
                    displayName: data.displayName,
                    username: data.username,
                    email: data.email,
                    password: data.password
                }
            })

            onActionSuccess();
        } catch (error) {
            if (error instanceof AxiosError) {
                // Here, we expect a 409 Conflict, in case the email (unlikely) or username already exists
                if (!error.response?.data?.success) {
                    const response = error.response?.data;
                    const errorMessage = response?.message || 'Registration failed. Please try again.'

                    // Check if it's a username or email conflict error
                    if (error.response?.status === 409) {
                        if (errorMessage.toLowerCase().includes('username')) {
                            setError('username', { message: errorMessage })
                        } else if (errorMessage.toLowerCase().includes('email')) {
                            setError('email', { message: errorMessage })
                        } else {
                            setError('root', { message: errorMessage })
                        }
                    } else {
                        setError('root', { message: errorMessage })
                    }
                }
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

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col gap-6'>
                        <div className='flex items-center gap-2'>
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => onEmailChange('')}
                                className='p-1 h-auto'
                            >
                                <ArrowLeft className='size-4' />
                            </Button>
                            <span className='text-sm text-muted-foreground'>
                                Create your account
                            </span>
                        </div>

                        <div className='grid grid-cols-2 gap-3'>
                            <div className='grid gap-2'>
                                <Label htmlFor='firstName'>First Name</Label>
                                <Input
                                    id='firstName'
                                    placeholder='John'
                                    autoComplete='name first'
                                    className={errors.lastName ? 'border-red-500' : ''}
                                    required
                                    {...register('firstName', { required: 'First name is required' })}
                                />
                                {errors.firstName && (
                                    <p className='text-sm text-red-500'>{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor='lastName'>Last Name</Label>
                                <Input
                                    id='lastName'
                                    placeholder='Doe'
                                    autoComplete='name last'
                                    className={errors.lastName ? 'border-red-500' : ''}
                                    required
                                    {...register('lastName', { required: 'Last name is required' })}
                                />
                                {errors.lastName && (
                                    <p className='text-sm text-red-500'>{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className='grid gap-3'>
                            <Label htmlFor='displayName'>Display Name</Label>
                            <Input
                                id='displayName'
                                placeholder='John Doe'
                                autoComplete='nickname'
                                className={errors.displayName ? 'border-red-500' : ''}
                                required
                                {...register('displayName', { required: 'Display name is required' })}
                            />
                            {errors.displayName && (
                                <p className='text-sm text-red-500'>{errors.displayName.message}</p>
                            )}
                        </div>

                        <div className='grid gap-3'>
                            <Label htmlFor='username'>Username</Label>
                            <Input
                                id='username'
                                placeholder='johndoe'
                                autoComplete='username'
                                className={errors.username ? 'border-red-500' : ''}
                                required
                                {...register('username', { required: 'Username is required!', minLength: { value: 3, message: 'Username must be at least 3 characters' } })}
                            />
                            {errors.username && (
                                <p className='text-sm text-red-500'>{errors.username.message}</p>
                            )}
                        </div>

                        <div className='grid gap-3'>
                            <Label htmlFor='signup-password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                placeholder='Create a password'
                                autoComplete='new-password'
                                className={errors.password ? 'border-red-500' : ''}
                                required
                                {...register('password', { required: 'Password is required!', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                            />
                            {errors.password && (
                                <p className='text-sm text-red-500'>{errors.password.message}</p>
                            )}
                        </div>

                        {errors.root && (
                            <p className='text-sm text-red-500 text-center'>{errors.root.message}</p>
                        )}

                        <Button
                            type='submit'
                            className='w-full'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </div>
                </form>

            </div>

            <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
                By registering, you agree to our <a href='#'>Terms of Service</a>{' '}
                and <a href='#'>Privacy Policy</a>.
            </div>
        </div>
    )
}
