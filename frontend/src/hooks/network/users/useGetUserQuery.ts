import { useQueryBase } from '../useQueryBase';
import { APIEndpoints } from '../../../config/api.config';

export const useGetUserQuery = useQueryBase(APIEndpoints.GET_USER, true, false);