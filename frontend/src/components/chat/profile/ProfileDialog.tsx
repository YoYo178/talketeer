import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useMe } from '@/hooks/network/users/useGetMeQuery';
import { useUpdateMeMutation } from '@/hooks/network/users/useUpdateMeMutation';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { CircleUserRound } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import z from 'zod';

const profileFormSchema = z.object({
    firstName: z.string().nonempty('First name is required'),
    lastName: z.string().nonempty('Last name is required'),
    displayName: z.string(),
    bio: z.string()
})

type ProfileFormFields = z.infer<typeof profileFormSchema>

export const ProfileDialog = () => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState } = useForm<ProfileFormFields>()
    const updateMeMutation = useUpdateMeMutation({});

    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState<{ [K in keyof ProfileFormFields]?: string } & { general?: string }>({})

    const me = useMe();

    if (!me)
        return;

    const initialFormState: ProfileFormFields = {
        firstName: me.name.split(' ')[0] || '',
        lastName: me.name.split(' ')[1] || '',
        displayName: me.displayName || '',
        bio: me.bio || '',
    };

    const handleProfileClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOpen(true);
    }

    const onSubmit: SubmitHandler<ProfileFormFields> = async (data: ProfileFormFields) => {
        setErrors({})

        try {
            const validatedData = profileFormSchema.parse({ ...data })

            // check if user exists
            const response = await updateMeMutation.mutateAsync({
                payload: { ...validatedData, name: validatedData.firstName + ' ' + validatedData.lastName }
            });

            if (response?.success) {
                reset({ ...validatedData }, {
                    keepDirty: false,
                    keepValues: false,
                })

                queryClient.invalidateQueries({ queryKey: ['users', 'me'] })

                setIsOpen(false);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {}
                error.issues.forEach(err => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message
                    }
                })
                setErrors(newErrors)
            } else if (error instanceof AxiosError) {
                // We have an unexpected error
                if (!error.response?.data?.success) {
                    const response = error.response?.data;
                    const errorMessage = response?.message || 'Something went wrong. Please try again.'
                    setErrors({ general: errorMessage })
                }
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' })
            }
        }
    }

    useEffect(() => {
        if (!isOpen) {
            reset(initialFormState, {
                keepDirty: false,
                keepValues: false,
            })
            setErrors({})
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onClick={handleProfileClick}>
                    <CircleUserRound />
                    Profile
                </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className='max-h-[85vh] overflow-hidden'>

                <DialogHeader>
                    <DialogTitle>Profile</DialogTitle>
                    <DialogDescription>View/edit your profile details</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                    <ScrollArea className='h-[50vh]'>
                        <div className='flex flex-col gap-4 mb-2 mx-4'>
                            <div className='flex-1 flex flex-wrap justify-center gap-4 w-full'>
                                <img
                                    className='rounded-full aspect-square max-h-[175px] max-w-[175px] h-[175px] w-[175px]'
                                    src={me.avatarURL}
                                    alt='Profile photo'
                                />
                                <div className='flex-1 flex flex-col gap-4'>
                                    <div className='flex-1 flex gap-2'>

                                        <div className='flex flex-col gap-2'>
                                            <Label>First Name</Label>
                                            <Input defaultValue={initialFormState.firstName} {...register('firstName')} autoComplete='name first' />
                                            {errors.firstName && (<p className='text-sm text-red-500'>{errors.firstName}</p>)}
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <Label>Last Name</Label>
                                            <Input defaultValue={initialFormState.lastName} {...register('lastName')} autoComplete='name last' />
                                            {errors.lastName && (<p className='text-sm text-red-500'>{errors.lastName}</p>)}
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2 cursor-not-allowed'>
                                        <Label>Email</Label>
                                        <Input defaultValue={me.email} disabled />
                                    </div>
                                    <div className='flex flex-col gap-2 cursor-not-allowed'>
                                        <Label>Username</Label>
                                        <Input defaultValue={me.username} disabled />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label>Display Name</Label>
                                        <Input defaultValue={initialFormState.displayName} {...register('displayName')} autoComplete='nickname' />
                                        {errors.displayName && (<p className='text-sm text-red-500'>{errors.displayName}</p>)}
                                    </div>
                                </div>
                            </div>

                            <div className='flex-1 flex flex-col gap-2'>
                                <Label>Bio</Label>
                                <Textarea
                                    className='min-h-30 resize-none max-h-30 overflow-y-auto whitespace-pre-wrap wrap-anywhere'
                                    defaultValue={initialFormState.bio}
                                    {...register('bio')}
                                    autoComplete='off'
                                />
                                {errors.bio && (<p className='text-sm text-red-500'>{errors.bio}</p>)}
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter>
                        {errors.general && (<p className='mr-auto text-sm text-red-500 self-center text-center'>{errors.general}</p>)}
                        <DialogClose asChild>
                            <Button type='button' variant='outline'>
                                Close
                            </Button>
                        </DialogClose>
                        {formState.isDirty && (<Button type='submit'>Save</Button>)}
                    </DialogFooter>
                </form>

            </DialogContent>

        </Dialog>
    )
}
