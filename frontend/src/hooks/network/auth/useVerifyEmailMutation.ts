import { APIEndpoints } from "@/config/api.config";
import { useMutationBase } from "../useMutationBase";

export const useVerifyEmailMutation = useMutationBase(APIEndpoints.VERIFY_EMAIL, 'Email verification', false);