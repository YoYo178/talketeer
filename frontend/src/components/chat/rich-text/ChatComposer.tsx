import { useRef, useState } from 'react';
import { SendButton } from './SendButton';
import { AttachFileButton } from './AttachFileButton';
import { socket } from '@/socket';
import { Textarea } from '@/components/ui/textarea';
import { GIFButton } from './GIFButton';
import { useRoomsStore, type TypingUser } from '@/hooks/state/useRoomsStore';
import { useMe } from '@/hooks/network/users/useGetMeQuery';
import { Ellipsis } from 'lucide-react';
import { useGetDmRoomByIdQuery } from '@/hooks/network/rooms/useGetDmRoomByIdQuery';

function buildTypingString(typingUsers: TypingUser[]) {
    switch (typingUsers.length) {
        case 0:
            return;
        case 1:
            return (
                <span className='w-full bg-accent dark:bg-primary-foreground text-sm flex gap-1 items-center'>
                    <Ellipsis className='size-5 animate-double-spin mr-6' />
                    <span className="font-semibold">{typingUsers[0].username}</span>
                    <span>is typing...</span>
                </span>
            );
        case 2:
            return (
                <span className='w-full bg-accent dark:bg-primary-foreground text-sm flex gap-1 items-center'>
                    <Ellipsis className='size-5 animate-double-spin mr-6' />
                    <span className="font-semibold">{typingUsers[0].username}</span>
                    <span>and</span>
                    <span className="font-semibold">{typingUsers[1].username}</span>
                    <span>are typing...</span>
                </span>
            );
        case 3:
            return (
                <span className='w-full bg-accent dark:bg-primary-foreground text-sm flex gap-1 items-center'>
                    <Ellipsis className='size-5 animate-double-spin mr-6' />
                    <span className="font-semibold">{typingUsers[0].username}</span>
                    <span>,&nbsp;</span>
                    <span className="font-semibold">{typingUsers[1].username}</span>
                    <span>, and</span>
                    <span className="font-semibold">{typingUsers[1].username}</span>
                    <span>are typing...</span>
                </span>
            );
        default:
            return (
                <span className='w-full bg-accent dark:bg-primary-foreground text-sm flex gap-1 items-center'>
                    <Ellipsis className='size-5 animate-double-spin mr-6' />
                    <span className="font-semibold">Several users</span>
                    <span>are typing...</span>
                </span>
            );
    }
}

export const ChatComposer = () => {
    const { joinedRoomId, dmRoomId, typingUsers } = useRoomsStore();
    const [message, setMessage] = useState('');

    const dmTypingUsers = !!dmRoomId ? typingUsers.filter(usr => usr.roomType === 'dm' && usr.roomId === dmRoomId) : [];
    const roomTypingUsers = !!joinedRoomId ? typingUsers.filter(usr => usr.roomType === 'normal' && usr.roomId === joinedRoomId) : [];

    const typingTimer = useRef<number>(null);

    const me = useMe();

    const { data } = useGetDmRoomByIdQuery({
        queryKey: ['dm-rooms', dmRoomId!],
        enabled: !!dmRoomId,
        pathParams: { roomId: dmRoomId! }
    })

    const dmRoom = data?.data?.room;

    const canSendMessage = !!dmRoomId ? (dmRoom && dmRoom.isActive) : true;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!me)
            return;

        setMessage(e.target.value);

        if (!!dmRoomId) {
            if (!e.target.value.length) {
                if (typingTimer.current)
                    clearTimeout(typingTimer.current);

                typingTimer.current = setTimeout(() => {
                    socket.emit('stopDmTyping', me._id, dmRoomId, () => { })
                    typingTimer.current = null;
                }, 1000);
                return;
            }

            if (typingTimer.current) {
                clearTimeout(typingTimer.current);
                typingTimer.current = null;
            } else
                socket.emit('startDmTyping', me._id, dmRoomId, me.username, () => { })

            typingTimer.current = setTimeout(() => {
                socket.emit('stopDmTyping', me._id, dmRoomId, () => { })
                typingTimer.current = null;
            }, 3000);
        } else if (!!joinedRoomId) {
            if (!e.target.value.length) {
                if (typingTimer.current)
                    clearTimeout(typingTimer.current);

                typingTimer.current = setTimeout(() => {
                    socket.emit('stopTyping', me._id, joinedRoomId, () => { })
                    typingTimer.current = null;
                }, 1000);
                return;
            }

            if (typingTimer.current) {
                clearTimeout(typingTimer.current);
                typingTimer.current = null;
            } else
                socket.emit('startTyping', me._id, joinedRoomId, me.username, () => { });

            typingTimer.current = setTimeout(() => {
                socket.emit('stopTyping', me._id, joinedRoomId, () => { });
                typingTimer.current = null;
            }, 3000);
        }
    }

    const sendMessage = () => {
        if (!me)
            return;

        if (!!dmRoomId) {
            socket.emit('sendMessage', true, dmRoomId, message, ({ success }) => {
                if (success)
                    setMessage('');
            })
        } else if (!!joinedRoomId) {
            socket.emit('sendMessage', false, joinedRoomId, message, ({ success }) => {
                if (success)
                    setMessage('');
            })
        }

        if (typingTimer.current) {
            clearTimeout(typingTimer.current);
            typingTimer.current = null;

            if (!!dmRoomId)
                socket.emit('stopDmTyping', me._id, dmRoomId, () => { });
            else if (!!joinedRoomId)
                socket.emit('stopTyping', me._id, joinedRoomId, () => { });
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form's default submit action

        if (message.trim())
            sendMessage();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Stop newline input if shift key isn't held
            handleSubmit(e as unknown as React.FormEvent);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='p-3 pt-2 flex items-center gap-3'>
            <div className="w-full flex flex-col gap-2">
                {!!dmRoomId ? buildTypingString(dmTypingUsers) : buildTypingString(roomTypingUsers)}
                <div className="flex w-full">
                    <AttachFileButton disabled={!canSendMessage} />
                    <Textarea
                        rows={1}
                        placeholder='Start typing...'
                        disabled={!canSendMessage}
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className='shadow-sm bg-background/90 border border-secondary focus-within:ring-2 focus-within:ring-primary min-h-0 resize-none max-h-24 overflow-y-auto whitespace-pre-wrap wrap-anywhere text-sm'
                    />
                    <div className='flex'>
                        <GIFButton disabled={!canSendMessage} />
                        <SendButton disabled={!canSendMessage} />
                    </div>
                </div>
            </div>
        </form>
    )
}
