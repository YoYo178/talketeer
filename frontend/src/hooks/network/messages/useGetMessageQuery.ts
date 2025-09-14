import type { IMessage } from "@/types/message.types";
import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

export const useGetMessageQuery = useQueryBase<{ message: IMessage }>(APIEndpoints.GET_MESSAGE_BY_ID, true, true);

export const useMessage = (messageId: string) => {
    const { data } = useGetMessageQuery({ queryKey: ['messages', messageId] });
    return data?.data?.message;
}