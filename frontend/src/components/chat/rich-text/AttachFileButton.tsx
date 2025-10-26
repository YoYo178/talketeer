import { Paperclip } from 'lucide-react'
import { ChatButton } from './utility/ChatButton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { FC } from 'react';

// TODO: functionality

interface AttachFileButtonProps {
    disabled?: boolean;
}

export const AttachFileButton: FC<AttachFileButtonProps> = ({ disabled }) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <ChatButton disabled={disabled}>
                    <Paperclip className='size-5' />
                </ChatButton>
            </TooltipTrigger>
            <TooltipContent>
                <p>Attach files</p>
            </TooltipContent>
        </Tooltip>
    )
}
