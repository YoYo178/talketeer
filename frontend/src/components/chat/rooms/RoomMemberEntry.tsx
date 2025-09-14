import { useGetUser } from "@/hooks/network/users/useGetUserQuery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { FC } from "react"
import { useMe } from "@/hooks/network/users/useGetMeQuery";
import { BanDialog } from "./administration/BanDialog";
import { KickDialog } from "./administration/KickDialog";
import { useRoomsStore } from "@/hooks/state/useRoomsStore";
import { useRoom } from "@/hooks/network/rooms/useGetRoomByIdQuery";

interface RoomMemberEntryProps {
    userId: string;
}

export const RoomMemberEntry: FC<RoomMemberEntryProps> = ({ userId }) => {
    const roomsStore = useRoomsStore();
    const { joinedRoomId } = roomsStore as typeof roomsStore & { joinedRoomId: string }

    const room = useRoom(joinedRoomId);

    const me = useMe();
    const user = useGetUser(userId);

    if (!room || !me || !user)
        return null;

    const isRoomOwner = me._id === room.owner;

    return (
        <div className='w-full flex my-2 justify-between'>
            <div className='flex gap-2'>
                <Avatar className='rounded-full size-10 object-cover drop-shadow-sm'>
                    <AvatarImage src={user.avatarURL} />
                    <AvatarFallback>{user.displayName.split(' ').map(str => str[0].toUpperCase()).join('')}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                    <p>{user.displayName}</p>
                    <p className='text-sm text-muted-foreground -translate-y-1'>@{user.username}</p>
                </div>
            </div>

            {isRoomOwner && me._id !== user._id && (
                <div className='flex gap-2'>
                    <KickDialog admin={me} user={user} room={room} />
                    <BanDialog admin={me} user={user} room={room} />
                </div>
            )}
        </div >
    )
}
