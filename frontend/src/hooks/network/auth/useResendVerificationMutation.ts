import { APIEndpoints } from "@/config/api.config";
import { useMutationBase } from "../useMutationBase";

interface ResendVerificationMutationBody {
    email: string;
}

export const useResendVerificationMutation = useMutationBase<ResendVerificationMutationBody>(APIEndpoints.VERIFY_EMAIL, 'Resending verification', false);