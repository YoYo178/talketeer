import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ChatButton } from './utility/ChatButton'

// TODO
export const GIFButton = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <ChatButton>GIF</ChatButton>
            </TooltipTrigger>
            <TooltipContent>
                <p>Send GIF</p>
            </TooltipContent>
        </Tooltip>
    )
}
