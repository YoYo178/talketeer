import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRequestPasswordResetMutation } from '@/hooks/network/auth/useRequestPasswordResetMutation'
import { useResetPasswordMutation } from '@/hooks/network/auth/useResetPasswordMutation'
import { useAuthStore } from '@/hooks/state/useAuthStore'
import { AxiosError } from 'axios'
import { MessagesSquare } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import z from 'zod'

const passwordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters')
})

export const ResetPage = () => {
    const { email } = useAuthStore();

    const navigate = useNavigate();
    const navigateToHome = useCallback(() => navigate('/auth'), []);

    const [searchParams] = useSearchParams();
    const userId = useMemo(() => searchParams.get('userId'), [searchParams]);
    const token = useMemo(() => searchParams.get('token'), [searchParams]);

    const requestResetMutation = useRequestPasswordResetMutation({ queryKey: ['request-password-reset', email] });
    const resetPasswordMutation = useResetPasswordMutation({ queryKey: ['reset-password', userId!] });

    const [didReset, setDidReset] = useState(false);
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // The request password reset mutation keeps triggering twice
    // it is actually because of strict mode but adding this makes it safer
    const didRequest = useRef(false);

    useEffect(() => {
        if (!didReset)
            return;

        const timeout = setTimeout(() => navigateToHome(), 3000);

        return () => clearTimeout(timeout);
    }, [didReset])

    useEffect(() => {
        if (!email.length && !token?.length && !userId?.length) {
            navigateToHome()
            return;
        }

        if (email.length && (!token?.length || !userId?.length)) {
            if (didRequest.current)
                return;

            requestResetMutation.mutate({
                payload: { email }
            })

            didRequest.current = true;
            return;
        }
    }, [email, userId, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // unlikely but typescript is typescript
        if (!token || !userId)
            return;

        const validated = passwordSchema.safeParse({ password });

        if (!validated.success) {
            setError(validated.error.issues?.[0]?.message);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords don\'t match!')
            return;
        }

        try {
            await resetPasswordMutation.mutateAsync({
                payload: {
                    userId,
                    password,
                    token
                }
            })

            setDidReset(true);
        } catch (err) {
            if (err instanceof AxiosError)
                setError(err.response?.data?.message)
        }
    }

    if (didReset)
        return (
            <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center gap-2 text-center'>
                    <Link
                        to='/'
                        className='flex flex-col items-center gap-2 font-medium'
                    >
                        <Button className='flex size-8 items-center justify-center rounded-md bg-transparent text-primary hover:bg-primary-foreground'>
                            <MessagesSquare className='size-6' />
                        </Button>
                        <span className='sr-only'>Talketeer</span>
                    </Link>
                    <h1 className='text-xl font-bold'>Reset password</h1>
                    <p className='text-muted-foreground mb-4'>
                        Your password has been reset successfully
                        <br />
                        Please login to continue.
                    </p>
                    <p className='text-muted-foreground mb-4'>Redirecting to home page...</p>
                </div>
            </div>
        )

    return (userId?.length && token?.length) ? (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2 text-center'>
                <Link
                    to='/'
                    className='flex flex-col items-center gap-2 font-medium'
                >
                    <Button className='flex size-8 items-center justify-center rounded-md bg-transparent text-primary hover:bg-primary-foreground'>
                        <MessagesSquare className='size-6' />
                    </Button>
                    <span className='sr-only'>Talketeer</span>
                </Link>
                <h1 className='text-xl font-bold'>Reset password</h1>
                <p className='text-sm text-muted-foreground mb-4'>You're about to reset your password. Make sure to choose one that's secure and memorable!</p>
                <form className='w-full' onSubmit={handleSubmit}>
                    <div className="w-full flex flex-col gap-4 mb-2">

                        <div className='grid gap-2'>
                            <Label className='text-muted-foreground'>New password</Label>
                            <Input
                                type='password'
                                value={password}
                                onChange={e => { setError(''); setPassword(e.target.value) }}
                            />
                        </div>

                        <div className='grid gap-2'>
                            <Label className='text-muted-foreground'>Confirm password</Label>
                            <Input
                                type='password'
                                value={confirmPassword}
                                onChange={e => { setError(''); setConfirmPassword(e.target.value) }}
                            />
                        </div>
                    </div>

                    {error.length > 0 && (
                        <p className='text-sm text-red-500'>{error}</p>
                    )}

                    <Button
                        className='w-full mt-4'
                        type='submit'
                        disabled={resetPasswordMutation.isPending}
                    >
                        {resetPasswordMutation.isPending ? 'Please wait...' : 'Change password'}
                    </Button>
                </form>

            </div>
        </div>
    ) : email.length > 0 && (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2 text-center'>
                <Link
                    to='/'
                    className='flex flex-col items-center gap-2 font-medium'
                >
                    <Button className='flex size-8 items-center justify-center rounded-md bg-transparent text-primary hover:bg-primary-foreground'>
                        <MessagesSquare className='size-6' />
                    </Button>
                    <span className='sr-only'>Talketeer</span>
                </Link>
                <h1 className='text-xl font-bold'>Reset password</h1>
                <p className='text-muted-foreground'>We've sent a password reset link to your email. Follow the instructions to set a new password.</p>
                <Button className='my-2 px-8' onClick={navigateToHome}>Ok</Button>
            </div>
        </div>
    )
}
