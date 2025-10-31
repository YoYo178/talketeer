import { useMutationBase } from "../useMutationBase";
import { APIEndpoints } from "../../../config/api.config";

export interface TCheckEmailBody {
    email: string;
}

export const useCheckEmailMutation = useMutationBase<TCheckEmailBody>(APIEndpoints.CHECK_EMAIL, "Checking if email exists");