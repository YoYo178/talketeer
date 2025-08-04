import { useQueryBase } from '../useQueryBase';
import { APIEndpoints } from '../../../config/api.config';

export const useGetMeQuery = useQueryBase(APIEndpoints.GET_ME, true, false);