import { useQueryBase } from '../useQueryBase';
import { APIEndpoints } from '../../../config/api.config';
import type { IPublicUser } from '@/types/user.types';

export const useGetUserQuery = useQueryBase<{ user: IPublicUser }>(APIEndpoints.GET_USER, true, true);