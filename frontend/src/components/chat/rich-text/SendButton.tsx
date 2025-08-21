
import { SendHorizontal } from 'lucide-react'
import { ChatButton } from './utility/ChatButton'

export const SendButton = () => {
    return (
        <ChatButton>
            <SendHorizontal className='size-5'/>
        </ChatButton>
    )
}
