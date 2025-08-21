import { Button } from '@/components/ui/button'
import type { FC, ReactNode } from 'react'

interface ChatButtonProps {
    children: ReactNode;
}

export const ChatButton: FC<ChatButtonProps> = ({ children }) => {
    return (
        <Button className='text-primary bg-transparent hover:bg-secondary'>
            {children}
        </Button>
    )
}
