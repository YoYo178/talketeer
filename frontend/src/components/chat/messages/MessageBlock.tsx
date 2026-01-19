import { useMe } from '@/hooks/network/users/useGetMeQuery';
import { memo, useState, type FC } from 'react'
import { UserProfilePicture, UserProfilePictureSkeleton } from '../UserProfilePicture';
import { MessageText, MessageTextSkeleton } from './MessageText';
import { useGetUser } from '@/hooks/network/users/useGetUserQuery';
import type { IMessage } from '@/types/message.types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { socket } from '@/socket';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import { useRoom } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import type { IRoom } from '@/types/room.types';

interface MessageBlockSkeletonProps {
    align: 'start' | 'end';
}

export const MessageBlockSkeleton: FC<MessageBlockSkeletonProps> = ({ align }) => {
    const generateArbitraryLines = (minLines: number, maxLines: number, minLength: number, maxLength: number) => {
        const lines = Math.max(minLines, Math.floor(Math.random() * maxLines));

        return Array.from({ length: lines }).map((_, i) => {
            const lineLength = Math.max(minLength, Math.floor(Math.random() * maxLength));
            return (
                <MessageTextSkeleton key={i} height={1} width={lineLength} />
            )
        })
    }

    return (
        <div className={`flex self-${align} gap-2 p-2 pb-1 mb-2 overflow-hidden` + (align === 'end' ? ' flex-row-reverse' : '')}>
            <UserProfilePictureSkeleton />
            <div className={`flex flex-col gap-2 items-${align}`}>
                {...generateArbitraryLines(2, 5, 6, 10)}
            </div>
        </div>
    )
}

interface MessageBlockProps {
    messages: IMessage[];
    senderId: string;
}

export const MessageBlock: FC<MessageBlockProps> = memo(({ messages, senderId }) => {
    const me = useMe();
    const user = useGetUser(senderId);
    const { joinedRoomId } = useRoomsStore();
    const room = useRoom<{ room: IRoom }>(joinedRoomId);

    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    const isSelfMessage = senderId === me?._id;
    const isRoomOwner = room?.owner === me?._id;

    const handleEdit = (message: IMessage) => {
        setEditingMessageId(message._id);
        setEditContent(message.content);
    };

    const handleSaveEdit = (messageId: string) => {
        if (!joinedRoomId || !editContent.trim()) return;

        socket.emit('editMessage', joinedRoomId, messageId, editContent.trim(), (response) => {
            if (response.success) {
                setEditingMessageId(null);
                setEditContent('');
            }
        });
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditContent('');
    };

    const handleDelete = (messageId: string) => {
        if (!joinedRoomId) return;

        socket.emit('deleteMessage', joinedRoomId, messageId, (response) => {
            // Message will be updated via socket event
        });
    };

    const renderMessage = (message: IMessage) => {
        // Show placeholder for deleted messages
        if (message.isDeleted) {
            return (
                <div key={message._id} className="text-muted-foreground italic text-sm py-1">
                    This message has been deleted
                </div>
            );
        }

        if (editingMessageId === message._id) {
            return (
                <div key={message._id} className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="bg-background border rounded px-2 py-1 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(message._id);
                            if (e.key === 'Escape') handleCancelEdit();
                        }}
                    />
                    <div className="flex gap-2 text-xs">
                        <button onClick={() => handleSaveEdit(message._id)} className="text-primary hover:underline">Save</button>
                        <button onClick={handleCancelEdit} className="text-muted-foreground hover:underline">Cancel</button>
                    </div>
                </div>
            );
        }

        const canEdit = isSelfMessage;
        const canDelete = isSelfMessage || isRoomOwner;

        return (
            <div key={message._id} className="group flex items-start gap-2">
                <div className="flex-1">
                    <MessageText content={message.content} isSelfMessage={isSelfMessage} />
                    {message.isEdited && (
                        <span className="text-xs text-muted-foreground ml-1">(edited)</span>
                    )}
                </div>
                {(canEdit || canDelete) && (
                    <DropdownMenu>
                        <DropdownMenuTrigger 
                            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer" 
                            asChild
                        >
                            <button 
                                className="p-1 hover:bg-accent rounded" 
                                aria-label="Message options"
                            >
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {canEdit && (
                                <DropdownMenuItem onClick={() => handleEdit(message)} className="cursor-pointer">
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <DropdownMenuItem onClick={() => handleDelete(message._id)} className="text-destructive cursor-pointer">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        );
    };

    return (
        <div className={
            'flex items-center gap-2 w-full p-2 pb-1 mb-2 hover:bg-accent ' +
            `${isSelfMessage ? 'justify-end' : 'justify-start'} `
        }>
            {isSelfMessage ? (
                <>
                    <div className='flex flex-col items-end w-full'>
                        <p className='text-muted-foreground text-sm'>
                            <span className='text-xs'>{new Date(messages[0].createdAt).toLocaleString()}</span>
                            <span className='text-[#383838] dark:text-[#696969] text-sm font-extrabold ml-2 mr-2'>——</span>
                            <span className='font-semibold'>You</span>
                        </p>
                        {messages.map(renderMessage)}
                    </div>
                    <UserProfilePicture user={me} popoverSide='left' />
                </>
            ) : (
                <>
                    <UserProfilePicture user={user} popoverSide='right' />
                    <div className='flex flex-col items-start w-full'>
                        <p className='text-muted-foreground text-sm'>
                            <span className='font-semibold'>{user?.displayName || user?.username}</span>
                            <span className='text-[#383838] dark:text-[#696969] text-sm font-extrabold ml-2 mr-2'>——</span>
                            <span className='text-xs'>{new Date(messages[0].createdAt).toLocaleString()}</span>
                        </p>
                        {messages.map(renderMessage)}
                    </div>
                </>
            )}
        </div>
    )
})

