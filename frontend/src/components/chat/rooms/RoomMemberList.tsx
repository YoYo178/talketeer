
import { useRoom } from "@/hooks/network/rooms/useGetRoomByIdQuery";
import { useRoomsStore } from "@/hooks/state/useRoomsStore";
import { RoomMemberEntry } from "./RoomMemberEntry"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { IRoom } from "@/types/room.types";

export const RoomMemberList = () => {
    const roomsStore = useRoomsStore();
    const { joinedRoomId } = roomsStore as typeof roomsStore & { joinedRoomId: string }

    const room = useRoom<{ room: IRoom }>(joinedRoomId);

    if (!room)
        return null;

    return (
        <ScrollArea className='flex-1 flex flex-col p-4 overflow-hidden rounded-xl border border-border/40 divide-y divide-border/40'>
            <div className="flex flex-col">
                {room.members?.map(mem => <RoomMemberEntry key={mem.user} userId={mem.user} />)}
            </div>
        </ScrollArea>
    )
}
