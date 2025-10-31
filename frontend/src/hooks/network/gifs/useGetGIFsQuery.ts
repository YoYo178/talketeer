import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "@/config/api.config";

export const useGetGIFsQuery = useQueryBase<TenorSearchResponse>(APIEndpoints.SEARCH_GIFS, true, true);

export const useGIFs = (query: string) => {
    const { data } = useGetGIFsQuery({ queryKey: ['gif-search', query], queryParams: { query } });
    return data?.data;
}