import type { INotification } from "@/types/notification.types";
import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

export const useGetNotificationsQuery = useQueryBase<{ notifications: INotification[] }>(APIEndpoints.GET_NOTIFICATIONS, true, true);

export const useNotifications = () => {
    const { data } = useGetNotificationsQuery({ queryKey: ['notifications'] });
    return data?.data?.notifications;
}