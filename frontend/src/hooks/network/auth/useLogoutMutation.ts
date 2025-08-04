import { useMutationBase } from "../useMutationBase";
import { APIEndpoints } from "../../../config/api.config";

export const useLogoutMutation = useMutationBase(APIEndpoints.LOGOUT, "Log out");