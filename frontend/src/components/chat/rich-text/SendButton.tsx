import { SendHorizontal } from 'lucide-react'
import { ChatButton } from './utility/ChatButton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export const SendButton = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <ChatButton type='submit' >
                    <SendHorizontal className='size-5' />
                </ChatButton>
            </TooltipTrigger>
            <TooltipContent>
                <p>Send message</p>
            </TooltipContent>
        </Tooltip>
    )
}
