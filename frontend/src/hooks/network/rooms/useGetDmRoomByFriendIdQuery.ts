import type { IDMRoom } from "@/types/room.types";
import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

export const useGetDmRoomByFriendIdQuery = useQueryBase<{ room: IDMRoom }>(APIEndpoints.GET_DM_ROOM_BY_FRIEND_ID, true, true);