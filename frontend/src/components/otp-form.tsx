import { ArrowLeft, MessagesSquare } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp'

import { useResendVerificationMutation } from '@/hooks/network/auth/useResendVerificationMutation';
import { useVerifyEmailMutation } from '@/hooks/network/auth/useVerifyEmailMutation';
import { useAuthStore } from '@/hooks/state/useAuthStore'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { AxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { getFooter } from '@/utils/misc.utils'

export function OTPForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { email } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [searchParams, setSearchParams] = useSearchParams();

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [resendText, setResendText] = useState('Resend');
    const [isVerified, setIsVerified] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const count = useRef(60);

    const userId = useMemo(() => searchParams.get('userId'), [searchParams]);
    const token = useMemo(() => searchParams.get('token'), [searchParams]);

    const verifyEmailMutation = useVerifyEmailMutation({ queryKey: ['email-verification'] });
    const resendVerificationMutation = useResendVerificationMutation({ queryKey: ['resend-verification'] });

    useEffect(() => {
        return () => {
            if (intervalRef.current)
                clearInterval(intervalRef.current)
        }
    }, [])

    useEffect(() => {
        if (!userId?.length) {
            navigate('/auth');
            return;
        }

        if (token?.length) {
            verifyEmailMutation.mutateAsync({
                payload: {
                    userId,
                    method: 'token',
                    data: token
                }
            })
                .then(res => setIsVerified(!!res?.success))
                .catch(err => {
                    if (err instanceof AxiosError)
                        setError(err.response?.data.message)
                    else
                        setError('Something went wrong, please try again later.')
                })
        }

    }, [userId, token]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isVerified)
            timer = setTimeout(() => {
                // Route wrappers will automatically handle the redirect
                queryClient.invalidateQueries({ queryKey: ['users'] });
            }, 3000);

        return () => {
            if (timer)
                clearTimeout(timer);
        }

    }, [isVerified])

    const handleResend = async () => {
        if (intervalRef.current)
            return;

        await resendVerificationMutation.mutateAsync({
            payload: {
                userId: userId!
            }
        })

        const interval = setInterval(() => {
            if (count.current <= 1) {
                setResendText('Resend');
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
                count.current = 60;
                return;
            }

            count.current = count.current - 1;
            setResendText(String(count.current));
        }, 1000);

        intervalRef.current = interval;
        setResendText(String(count.current));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (code.length) {
                await verifyEmailMutation.mutateAsync({
                    payload: {
                        userId: userId!,
                        method: 'code',
                        data: code
                    }
                })

                setIsVerified(true)
            }
        } catch (error) {
            if (error instanceof AxiosError)
                setError(error.response?.data.message || '');
            else
                setError('Something went wrong, please try again later.')
        }
    }

    return (
        <>
            {token && token.length > 0 ? (
                <div className={cn('flex flex-col gap-6', className)} {...props}>
                    <FieldGroup>
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
                            {!isVerified ? (
                                <h1 className='text-xl font-bold'>Verifying... Please wait</h1>
                            ) : (
                                <>
                                    <h1 className='text-xl font-bold'>Verified successfully</h1>
                                    <span>Redirecting to dashboard...</span>
                                </>
                            )}
                        </div>
                    </FieldGroup>
                </div>
            ) : (
                <>
                    {!isVerified ? (
                        <div className={cn('flex flex-col gap-6', className)} {...props}>
                            <form onSubmit={handleSubmit}>
                                <FieldGroup>
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
                                        <h1 className='text-xl font-bold'>Enter verification code</h1>
                                        <FieldDescription className='flex flex-col gap-4'>

                                            <span className='flex justify-center -translate-x-4'>

                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() => setSearchParams(prev => { prev.delete('userId'); return prev })}
                                                    className='p-1 h-auto'
                                                >
                                                    <ArrowLeft className='size-4' />
                                                </Button>
                                                <span>We sent a 6-digit code to your email address</span>
                                            </span>

                                            <span className='text-xl font-bold'>{email}</span>
                                            <span>Optionally, you may also verify using the link provided in the email</span>
                                        </FieldDescription>
                                    </div>
                                    <Field>
                                        <FieldLabel htmlFor='otp' className='sr-only'>
                                            Verification code
                                        </FieldLabel>
                                        <div className='flex flex-col items-center gap-2'>
                                            <InputOTP
                                                maxLength={6}
                                                id='otp'
                                                required
                                                containerClassName='gap-4 flex items-center justify-center'
                                                pattern={REGEXP_ONLY_DIGITS}
                                                value={code}
                                                onChange={(value) => { setError(''); setCode(value) }}
                                            >
                                                <InputOTPGroup
                                                    className={`
                                                        gap-2.5
                                                        *:data-[slot=input-otp-slot]:h-16
                                                        *:data-[slot=input-otp-slot]:w-12
                                                        *:data-[slot=input-otp-slot]:rounded-md
                                                        *:data-[slot=input-otp-slot]:border
                                                        *:data-[slot=input-otp-slot]:text-xl
                                                        ${error.length ? '*:border-red-500' : ''}
                                                    `}
                                                >
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                            {error.length > 0 && (
                                                <FieldDescription className='text-red-500'>
                                                    {error}
                                                </FieldDescription>
                                            )}

                                        </div>
                                        <FieldDescription className='text-center flex justify-between'>
                                            <span>Didn&apos;t receive the code?</span>
                                            <button
                                                type='button'
                                                className={`underline ${intervalRef.current ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                onClick={handleResend}
                                                disabled={!!intervalRef.current}
                                            >
                                                {resendVerificationMutation.isPending ? 'Resending...' : resendText}
                                            </button>
                                        </FieldDescription>
                                    </Field>
                                    <Field>
                                        <Button
                                            type='submit'
                                            disabled={verifyEmailMutation.isPending}
                                        >
                                            {verifyEmailMutation.isPending ? 'Verifying... Please wait' : 'Verify'}
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                            <FieldDescription className='px-6 text-center'>
                                {getFooter()}
                            </FieldDescription>
                        </div>
                    ) : (
                        <div className={cn('flex flex-col gap-6', className)} {...props}>
                            <FieldGroup>
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
                                    <h1 className='text-xl font-bold'>Verified successfully</h1>
                                    <span>Redirecting to dashboard...</span>
                                </div>
                            </FieldGroup>
                        </div>
                    )}
                </>
            )}

        </>
    )
}
