import { APIEndpoints } from "@/config/api.config";
import { useMutationBase } from "../useMutationBase";

export const useAcceptFriendRequestMutation = useMutationBase(APIEndpoints.ACCEPT_FRIEND_REQUEST, 'Accepting friend request', true);