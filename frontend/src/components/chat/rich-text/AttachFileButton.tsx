import { Paperclip } from 'lucide-react'
import { ChatButton } from './utility/ChatButton'

// TODO: functionality

export const AttachFileButton = () => {
    return (
        <ChatButton>
            <Paperclip className='size-5' />
        </ChatButton>
    )
}
