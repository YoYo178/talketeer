import { useMutationBase } from "../useMutationBase";
import { APIEndpoints } from "../../../config/api.config";

export interface TLoginMutationBody {
    email: string;
    password: string;
}

export const useLoginMutation = useMutationBase<TLoginMutationBody>(APIEndpoints.LOGIN, "Login", true);