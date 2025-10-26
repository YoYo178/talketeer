import { useQueryBase } from '../useQueryBase';
import { APIEndpoints } from '../../../config/api.config';
import type { IPublicUser } from '@/types/user.types';

export const useGetUserQuery = useQueryBase<{ user: IPublicUser }>(APIEndpoints.GET_USER, true, true);

export const useGetUser = (userId: string | null | undefined) => {
    const { data } = useGetUserQuery({
        queryKey: ['users', userId!],
        pathParams: { userId: userId! },
        enabled: !!userId
    })
    return data?.data?.user;
}