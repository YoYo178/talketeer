import { useMutationBase } from "../useMutationBase";
import { APIEndpoints } from "../../../config/api.config";

export interface TUpdateMeBody {
    name: string;
    displayName: string;
    bio: string;
}

export const useUpdateMeMutation = useMutationBase<TUpdateMeBody>(APIEndpoints.UPDATE_ME, "Updating me user", true);