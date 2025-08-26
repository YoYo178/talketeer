import { Button } from '@/components/ui/button'
import type { FC, ReactNode } from 'react'

type ChatButtonProps = {
    children: ReactNode;
} & React.ComponentProps<'button'>

export const ChatButton: FC<ChatButtonProps> = ({ children, ...props }) => {
    return (
        <Button className='text-primary bg-transparent hover:bg-secondary' {...props}>
            {children}
        </Button>
    )
}
