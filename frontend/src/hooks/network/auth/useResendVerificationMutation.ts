import { APIEndpoints } from "@/config/api.config";
import { useMutationBase } from "../useMutationBase";

interface ResendVerificationMutationBody {
    userId: string;
}

export const useResendVerificationMutation = useMutationBase<ResendVerificationMutationBody>(APIEndpoints.RESEND_VERIFICATION, 'Resending verification');