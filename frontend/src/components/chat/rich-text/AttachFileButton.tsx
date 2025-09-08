import { Paperclip } from 'lucide-react'
import { ChatButton } from './utility/ChatButton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// TODO: functionality

export const AttachFileButton = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <ChatButton>
                    <Paperclip className='size-5' />
                </ChatButton>
            </TooltipTrigger>
            <TooltipContent>
                <p>Attach files</p>
            </TooltipContent>
        </Tooltip>
    )
}
