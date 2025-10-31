import { APIEndpoints } from "@/config/api.config";
import { useMutationBase } from "../useMutationBase";

interface ResetPasswordMutationBody {
    userId: string;
    password: string;
    token: string;
}

export const useResetPasswordMutation = useMutationBase<ResetPasswordMutationBody>(APIEndpoints.RESET_PASSWORD, 'Resetting password');