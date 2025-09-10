import { useQueryBase } from '../useQueryBase';
import { APIEndpoints } from '../../../config/api.config';
import type { IUser } from '@/types/user.types';

export const useGetMeQuery = useQueryBase<{ user: IUser }>(APIEndpoints.GET_ME, true, true);