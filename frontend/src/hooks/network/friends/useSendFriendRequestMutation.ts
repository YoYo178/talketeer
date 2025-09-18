import { APIEndpoints } from "@/config/api.config";
import { useMutationBase } from "../useMutationBase";

export const useSendFriendRequestMutation = useMutationBase(APIEndpoints.SEND_FRIEND_REQUEST, 'Sending friend request', true);