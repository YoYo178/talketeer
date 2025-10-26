import { SendHorizontal } from 'lucide-react'
import { ChatButton } from './utility/ChatButton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { FC } from 'react';

interface SendButtonProps {
    disabled?: boolean;
}

export const SendButton: FC<SendButtonProps> = ({ disabled }) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <ChatButton type='submit' disabled={disabled}>
                    <SendHorizontal className='size-5' />
                </ChatButton>
            </TooltipTrigger>
            <TooltipContent>
                <p>Send message</p>
            </TooltipContent>
        </Tooltip>
    )
}
