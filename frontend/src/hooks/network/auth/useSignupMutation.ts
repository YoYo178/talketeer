import { useMutationBase } from "../useMutationBase";
import { APIEndpoints } from "../../../config/api.config";

export interface TSignupMutationBody {
    name: string;
    displayName: string;
    username: string;

    email: string;
    password: string;
}

export interface TSignupMutationResponse {
    user: {
        _id: string;
    }
}

export const useSignupMutation = useMutationBase<TSignupMutationBody, TSignupMutationResponse>(APIEndpoints.SIGNUP, "Sign up");