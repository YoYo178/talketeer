import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { API } from "../../config/api.config";

import type { Endpoint } from "../../types/api.types";
import { injectPathParams } from "../../utils/api.utils";

export function useQueryBase(endpoint: Endpoint, sendCookies: boolean = false, shouldRetry: boolean | ((failureCount: number, error: any) => boolean) = false, staleTime: number | undefined = undefined) {
    return ({ queryKey, pathParams, enabled = true }: { queryKey?: string[]; pathParams?: Record<string, string>; enabled?: boolean }) => {
        const URL = pathParams ? injectPathParams(endpoint.URL, pathParams) : endpoint.URL;

        return useQuery({
            queryKey: queryKey || [],
            queryFn: async () => {
                const { data } = await API.get(URL, { withCredentials: sendCookies });
                return data;
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