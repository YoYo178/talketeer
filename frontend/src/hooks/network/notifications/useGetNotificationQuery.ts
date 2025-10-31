import type { INotification } from "@/types/notification.types";
import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

export const useGetNotificationQuery = useQueryBase<{ notification: INotification }>(APIEndpoints.GET_NOTIFICATION_BY_ID, true, true);

export const useNotification = (notificationId: string) => {
    const { data } = useGetNotificationQuery({ queryKey: ['notifications', notificationId] });
    return data?.data?.notification;
}