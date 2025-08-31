
import { SendHorizontal } from 'lucide-react'
import { ChatButton } from './utility/ChatButton'

export const SendButton = () => {
    return (
        <ChatButton type='submit' >
            <SendHorizontal className='size-5' />
        </ChatButton>
    )
}
