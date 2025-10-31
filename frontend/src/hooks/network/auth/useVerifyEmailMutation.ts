import { APIEndpoints } from "@/config/api.config";
import { useMutationBase } from "../useMutationBase";

interface VerifyEmailMutationBody {
    userId: string;
    method: 'code' | 'token';
    data: string;
}

export const useVerifyEmailMutation = useMutationBase<VerifyEmailMutationBody>(APIEndpoints.VERIFY_EMAIL, 'Email verification', true);