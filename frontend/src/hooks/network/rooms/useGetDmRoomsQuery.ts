import type { IDMRoom } from "@/types/room.types";
import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

export const useGetDMRoomsQuery = useQueryBase<{ rooms: IDMRoom[] }>(APIEndpoints.GET_ALL_DM_ROOMS, true, true);

export const useDMRooms = () => {
    const { data } = useGetDMRoomsQuery({ queryKey: ['dm-rooms'] });
    return data?.data?.rooms || [];
}