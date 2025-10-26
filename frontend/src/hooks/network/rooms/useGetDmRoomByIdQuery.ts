import type { IDMRoom } from "@/types/room.types";
import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

export const useGetDmRoomByIdQuery = useQueryBase<{ room: IDMRoom }>(APIEndpoints.GET_DM_ROOM_BY_ID, true, true);