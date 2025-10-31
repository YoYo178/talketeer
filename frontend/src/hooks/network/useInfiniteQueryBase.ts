import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { API } from "../../config/api.config";

import type { APICursorResponse, Endpoint } from "../../types/api.types";
import { injectPathParams, injectQueryParams } from "../../utils/api.utils";

interface InfiniteQueryBaseParams {
    queryKey?: string[];
    pathParams?: Record<string, string>;
    queryParams?: Record<string, string>;
    enabled?: boolean
}

export const useInfiniteQueryBase = <ResponseType = undefined>(
    endpoint: Endpoint,
    sendCookies: boolean = false,
    shouldRetry: boolean | ((failureCount: number, error: any) => boolean) = false,
    staleTime: number | undefined = undefined
) => {
    return ({ queryKey, pathParams, queryParams, enabled = true }: InfiniteQueryBaseParams) => {
        let URL = endpoint.URL;

        if (!!pathParams)
            URL = injectPathParams(URL, pathParams);

        if (!!queryParams)
            URL = injectQueryParams(URL, queryParams);

        return useInfiniteQuery({
            queryKey: queryKey || [],
            queryFn: async ({ pageParam }) => {
                let finalURL = endpoint.URL;

                if (pageParam.length)
                    finalURL = injectQueryParams(finalURL, { ...queryParams, before: pageParam })

                const response = await API.get<APICursorResponse<ResponseType>>(
                    pageParam.length ? finalURL : URL,
                    { withCredentials: sendCookies }
                );
                return response?.data;
            },

            initialPageParam: '',
            getNextPageParam: (lastPage) => lastPage.data.nextCursor,

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
            enabled,
        });
    };
}