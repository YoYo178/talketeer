export function injectPathParams(url: string, pathParams: Record<string, string>): string {
    let updatedUrl = url;
    for (const key in pathParams) {
        updatedUrl = updatedUrl.replace(`:${key}`, encodeURIComponent(pathParams[key]));
    }
    return updatedUrl;
}

export const injectQueryParams = (url: string, queryParams?: Record<string, string>) => {
    if (!queryParams) return url;

    const queryString = new URLSearchParams(queryParams).toString();
    return `${url}?${queryString}`;
};