import { APIEndpoints } from "@/config/api.config";
import { useMutationBase } from "../useMutationBase";

interface RequestPasswordResetMutationBody {
    email: string;
}

export const useRequestPasswordResetMutation = useMutationBase<RequestPasswordResetMutationBody>(APIEndpoints.REQUEST_PASSWORD_RESET, 'Requesting password reset');