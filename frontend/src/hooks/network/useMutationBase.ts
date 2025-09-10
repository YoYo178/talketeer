import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, type AxiosResponse } from "axios";

import { API } from "../../config/api.config";
import type { APIResponse, Endpoint } from "../../types/api.types";
import { injectPathParams, injectQueryParams } from "../../utils/api.utils";

interface MutationBaseParams<PayloadType> {
    payload?: PayloadType
    queryParams?: Record<string, string>
    pathParams?: Record<string, string>
}

export const useMutationBase = <PayloadType, ResponseType = {}>(
    endpoint: Endpoint,
    actionName: string,
    sendAndAcceptCookies: boolean = false,
    options?: {
        optimisticUpdate?: (variables: { payload: PayloadType }, oldData: any) => any;
    }
) => {
    return ({ queryKey = [] }: { queryKey?: string[]; }) => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async ({ payload, queryParams = {}, pathParams = {} }: MutationBaseParams<PayloadType>) => {
                // @ts-ignore
                const HTTPFunc = API[endpoint.METHOD.toLowerCase()];

                let URL = endpoint.URL;

                if (Object.keys(pathParams).length)
                    URL = injectPathParams(URL, pathParams);

                if (Object.keys(queryParams).length)
                    URL = injectQueryParams(URL, queryParams)

                let response: AxiosResponse<APIResponse<ResponseType>> | null = null;

                if (["POST", "PUT", "PATCH"].includes(endpoint.METHOD))
                    response = await HTTPFunc(URL, payload, { withCredentials: sendAndAcceptCookies });

                if (endpoint.METHOD === "DELETE")
                    response = await HTTPFunc(URL, { withCredentials: sendAndAcceptCookies, data: payload });

                if (endpoint.METHOD === "OPTIONS")
                    response = await HTTPFunc(URL, { withCredentials: sendAndAcceptCookies });

                return response?.data || null;
            },

            onMutate: async (variables) => {
                await queryClient.cancelQueries({ queryKey });

                const previousData = queryClient.getQueryData(queryKey);

                if (queryKey.length && options?.optimisticUpdate) {
                    const updated = options.optimisticUpdate(variables as { payload: PayloadType }, previousData);
                    queryClient.setQueryData(queryKey, updated);
                }

                return { previousData };
            },

            onError: (err, _variables, context) => {
                if (context?.previousData) {
                    queryClient.setQueryData(queryKey, context.previousData);
                }

                if (axios.isAxiosError(err)) {
                    const error = err as AxiosError<{ message: unknown }>;
                    console.error(`${actionName} failed:`, error?.response?.data?.message);
                } else if (err instanceof Error) {
                    console.error(`${actionName} failed:`, err?.message);
                } else {
                    console.error("Unknown error occurred", err);
                }
            },

            onSettled: (_data, _error, _variables, _context) => {
                if (!options?.optimisticUpdate) {
                    queryClient.invalidateQueries({ queryKey });
                }
            },
        });
    };
};