import type { IMessage } from "@/types/message.types";
import { APIEndpoints } from "@/config/api.config";
import { useInfiniteQueryBase } from "../useInfiniteQueryBase";

export const useGetDmMessagesQuery = useInfiniteQueryBase<{ messages: IMessage[] }>(APIEndpoints.GET_DM_MESSAGES, true, true);