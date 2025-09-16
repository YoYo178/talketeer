import type { IRoom } from "@/types/room.types";
import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

// TODO: this actually returns "IRoomPublicView | IRoom", but the components don't like it
export const useGetRoomByIdQuery = useQueryBase<{ room: IRoom }>(APIEndpoints.GET_ROOM_BY_ID, true, true);

export const useRoom = (roomId: string | null) => {
    const { data } = useGetRoomByIdQuery({
        queryKey: ['rooms', roomId || ''],
        pathParams: { roomId: roomId || '' },
        enabled: !!roomId
    });

    if (!roomId)
        return null;

    return data?.data?.room;
}