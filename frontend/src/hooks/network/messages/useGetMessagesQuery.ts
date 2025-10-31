import type { IMessage } from "@/types/message.types";
import { APIEndpoints } from "@/config/api.config";
import { useInfiniteQueryBase } from "../useInfiniteQueryBase";

export const useGetMessagesQuery = useInfiniteQueryBase<{ messages: IMessage[] }>(APIEndpoints.GET_MESSAGES, true, true);