import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

export const useGetRoomsQuery = useQueryBase(APIEndpoints.GET_ALL_ROOMS, true, false);


