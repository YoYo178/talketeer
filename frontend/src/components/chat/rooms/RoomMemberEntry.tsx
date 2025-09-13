import { useGetUserQuery } from "@/hooks/network/users/useGetUserQuery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type FC } from "react"
import { useGetMeQuery } from "@/hooks/network/users/useGetMeQuery";
import type { IRoom } from "@/types/room.types";
import { BanDialog } from "./administration/BanDialog";
import { KickDialog } from "./administration/KickDialog";

interface RoomMemberEntryProps {
    selectedRoom: IRoom;
    userId: string;
}

export const RoomMemberEntry: FC<RoomMemberEntryProps> = ({ userId, selectedRoom }) => {
    const { data: meData } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const me = meData?.data?.user;
    const isRoomOwner = me?._id === selectedRoom.owner;

    const { data } = useGetUserQuery({
        queryKey: ['users', userId],
        pathParams: { userId }
    })
    const otherUser = data?.data?.user;

    if (!me || !otherUser)
        return null;

    return (
        <div className='w-full flex my-2 justify-between'>
            <div className='flex gap-2'>
                <Avatar className='rounded-full size-10 object-cover drop-shadow-sm'>
                    <AvatarImage src={otherUser?.avatarURL} />
                    <AvatarFallback>{otherUser?.displayName.split(' ').map(str => str[0].toUpperCase()).join('')}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                    <p>{otherUser?.displayName}</p>
                    <p className='text-sm text-muted-foreground -translate-y-1'>@{otherUser?.username}</p>
                </div>
            </div>

            {isRoomOwner && me._id !== otherUser._id && (
                <div className='flex gap-2'>
                    <KickDialog admin={me} user={otherUser} room={selectedRoom} />
                    <BanDialog admin={me} user={otherUser} room={selectedRoom} />
                </div>
            )}
        </div >
    )
}
