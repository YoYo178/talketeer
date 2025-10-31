import type { IRoom, IRoomPublicView } from "@/types/room.types";
import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

export const useGetRoomsQuery = useQueryBase<{ rooms: (IRoom | IRoomPublicView)[] }>(APIEndpoints.GET_ALL_ROOMS, true, true);

export const useRooms = () => {
    const { data } = useGetRoomsQuery({ queryKey: ['rooms'] });
    return data?.data?.rooms || [];
}