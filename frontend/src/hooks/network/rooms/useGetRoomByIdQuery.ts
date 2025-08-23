import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

export const useGetRoomByIdQuery = useQueryBase(APIEndpoints.GET_ROOM_BY_ID, true, true);


