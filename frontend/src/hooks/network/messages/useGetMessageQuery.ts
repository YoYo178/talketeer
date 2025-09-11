import type { IMessage } from "@/types/message.types";
import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

export const useGetMessageQuery = useQueryBase<{ messages: IMessage }>(APIEndpoints.GET_MESSAGE_BY_ID, true, true);