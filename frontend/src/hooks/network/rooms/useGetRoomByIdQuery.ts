import type { IRoom, IRoomPublicView } from "@/types/room.types";
import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

type GetRoomByIdResponse = { room: IRoomPublicView | IRoom };

export const useGetRoomByIdQuery = useQueryBase<GetRoomByIdResponse>(APIEndpoints.GET_ROOM_BY_ID, true, true);

export const useRoom = <ResponseTypeOverride extends GetRoomByIdResponse = GetRoomByIdResponse>(roomId: string | null): ResponseTypeOverride['room'] | null => {
    const { data } = useGetRoomByIdQuery<ResponseTypeOverride>({
        queryKey: ['rooms', roomId || ''],
        pathParams: { roomId: roomId || '' },
        enabled: !!roomId
    });

    if (!roomId || !data?.data?.room)
        return null;

    return data.data.room;
}