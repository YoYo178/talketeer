import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { API } from "../../config/api.config";

import type { APIResponse, Endpoint } from "../../types/api.types";
import { injectPathParams, injectQueryParams } from "../../utils/api.utils";

interface QueryBaseParams {
    queryKey?: string[];
    pathParams?: Record<string, string>;
    queryParams?: Record<string, string>;
    enabled?: boolean
}

export const useQueryBase = <ResponseType = unknown>(
    endpoint: Endpoint,
    sendCookies: boolean = false,
    shouldRetry: boolean | ((failureCount: number, error: any) => boolean) = false,
    staleTime: number | undefined = undefined
) => {
    return <ResponseTypeOverride = ResponseType>({ queryKey, pathParams, queryParams, enabled = true }: QueryBaseParams) => {
        let URL = endpoint.URL;

        if (!!pathParams)
            URL = injectPathParams(URL, pathParams);

        if (!!queryParams)
            URL = injectQueryParams(URL, queryParams);

        return useQuery({
            queryKey: queryKey || [],
            queryFn: async ({ signal }) => {
                const response = await API.get<APIResponse<ResponseTypeOverride>>(URL, { withCredentials: sendCookies, signal });
                return response?.data;
            },
            retry: (failureCount: number, error: AxiosError) => {
                if (typeof shouldRetry === "function")
                    return shouldRetry(failureCount, error);

                if (error.status === 401)
                    return false;

                return shouldRetry;
            },
            staleTime,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            enabled
        });
    };
}