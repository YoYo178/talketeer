import type { IRoom } from "@/types/room.types"
import type { FC } from "react"
import { RoomMemberEntry } from "./RoomMemberEntry"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RoomMemberListProps {
    selectedRoom: IRoom
}

export const RoomMemberList: FC<RoomMemberListProps> = ({ selectedRoom }) => {
    return (
        <ScrollArea className='flex-1 flex flex-col p-4 overflow-hidden'>
            {selectedRoom.members?.map(mem => <RoomMemberEntry key={mem.user} selectedRoom={selectedRoom} userId={mem.user} />)}
        </ScrollArea>
    )
}
