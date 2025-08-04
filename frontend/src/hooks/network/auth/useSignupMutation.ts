import { useMutationBase } from "../useMutationBase";
import { APIEndpoints } from "../../../config/api.config";

export interface TSignupMutationBody {
    name: string;
    displayName: string;
    username: string;

    email: string;
    password: string;
}

export const useSignupMutation = useMutationBase<TSignupMutationBody>(APIEndpoints.SIGNUP, "Sign up");