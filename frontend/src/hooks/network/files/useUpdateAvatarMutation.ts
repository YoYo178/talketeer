import { useMutationBase } from "../useMutationBase";
import { APIEndpoints } from "../../../config/api.config";

export const useUpdateAvatarMutation = useMutationBase<FormData>(APIEndpoints.UPDATE_AVATAR, "Update avatar", true);