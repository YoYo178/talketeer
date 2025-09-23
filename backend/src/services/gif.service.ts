/**
 * @note This file contains parts of Tenor's official V2 API documentation.
 * @see https://developers.google.com/tenor/guides/quickstart
 */

import ENV from "@src/common/ENV";
import logger from "@src/utils/logger.utils";

// Helper type to obscure (omit) key fields
type Obs<T> = Omit<T, 'key' | 'client-key'>;

export class TenorClient {
    private static instance: TenorClient;

    private constructor(
        private readonly apiKey: string,
        private readonly baseUrl: string,
        private readonly clientKey?: string
    ) { }

    static init(apiKey: string, baseUrl: string, clientKey?: string): TenorClient {
        if (!TenorClient.instance) {
            TenorClient.instance = new TenorClient(apiKey, baseUrl, clientKey);
            Object.freeze(TenorClient.instance);
        } else {
            logger.warn('[TenorClient] Attempted to initialize more than once!');
        }

        return TenorClient.getInstance();
    }

    static getInstance(): TenorClient {
        if (!TenorClient.instance)
            throw new Error('[TenorClient] getInstance() called before initialization!');

        return TenorClient.instance;
    }

    /**
     * PType - Parameters type
     * RType - Response type
     */
    private async fetch<PType extends {}, RType>(url: URL, params: PType): Promise<RType> {
        url.searchParams.append('key', this.apiKey);

        if (this.clientKey)
            url.searchParams.append('client_key', this.clientKey);

        for (const [key, value] of Object.entries(params))
            url.searchParams.append(key, String(value));

        const response = await fetch(url.toString())
        return response.json() as Promise<RType>;
    }

    /**
     * Get a JSON object that contains a list of the most relevant GIFs for a given set of search terms, categories, emojis, or any combination of these.
     *
     * When you include the URL parameter searchfilter=sticker in the request, Tenor's search endpoint returns stickers rather than GIFs. The Response Objects in sticker search responses include transparent formats under the media_formats field.
     *
     * To return the results in a randomized order, instead of them being ordered by relevance, set the `random` parameter to true
     * @param q A search string
     * @param options Other parameters for the search endpoint.
     * 
     * @see https://developers.google.com/tenor/guides/endpoints#search
     */
    async search(
        q: string,
        options: Omit<Obs<TenorSearchParameters>, 'q'> = {
            country: 'US',
            locale: 'en_US',
            contentfilter: 'off',
            random: false,
            limit: 20,
        }): Promise<TenorSearchResponse> {
        const reqURL = new URL(this.baseUrl + 'search');
        reqURL.searchParams.append('q', q);

        return this.fetch
            <
                Omit<Obs<TenorSearchParameters>, 'q'>,
                TenorSearchResponse
            >(reqURL, options);
    }

    /**
     * Get a JSON object that contains a list of the current global featured GIFs. Tenor updates the featured stream regularly throughout the day.
     *
     * When the parameter `searchfilter` is set to `sticker`,
     * Tenor's Featured endpoint returns stickers rather than GIFs.
     * In sticker featured responses,
     * Response Objects include transparent formats under the media field.
     * 
     * @param options Other parameters for the Featured endpoint
     * 
     * @see https://developers.google.com/tenor/guides/endpoints#featured
     */
    async getFeatured(options: Obs<TenorFeaturedParameters> = {
        country: 'US',
        locale: 'en_US',
        contentfilter: 'off',
        limit: 20,
    }): Promise<TenorFeaturedResponse> {
        const reqURL = new URL(this.baseUrl + 'featured');
        return this.fetch
            <
                Obs<TenorFeaturedParameters>,
                TenorFeaturedResponse
            >(reqURL, options);
    }

    /**
     * Get a JSON object that contains a list of GIF categories associated with the provided type.
     * Each category includes a corresponding search URL to use if the user clicks on the category.
     * The search URL includes any parameters from the original call to the Categories endpoint.
     * 
     * @param options Other parameters for the Categories endpoint
     * 
     * @see https://developers.google.com/tenor/guides/endpoints#categories
     */
    async getCategories(options: Obs<TenorCategoriesParameters> = {
        country: 'US',
        locale: 'en_US',
        contentfilter: 'off',
        type: 'featured'
    }): Promise<TenorCategoriesResponse> {
        const reqURL = new URL(this.baseUrl + 'categories');

        return this.fetch<
            Obs<TenorCategoriesParameters>,
            TenorCategoriesResponse
        >(reqURL, options);
    }

    /**
     * Get a JSON object that contains a list of alternative search terms for a given search term.
     *
     * Search suggestions help a user narrow their search or discover related search terms to find a more precise GIF.
     * The API returns results in order of what is most likely to drive a share for a given term,
     * based on historic user search and share behavior.
     * 
     * @param options Other parameters for the Categories endpoint
     * 
     * @see https://developers.google.com/tenor/guides/endpoints#search-suggestions
     */
    async getSearchSuggestions(q: string, options: Omit<Obs<TenorSearchSuggestionsParameters>, 'q'> = {
        country: 'US',
        locale: 'en_US',
        limit: 20,
    }): Promise<TenorSearchSuggestionsResponse> {
        const reqURL = new URL(this.baseUrl + 'search_suggestions');
        reqURL.searchParams.append('q', q);

        return this.fetch
            <
                Omit<Obs<TenorSearchSuggestionsParameters>, 'q'>,
                TenorSearchSuggestionsResponse
            >(reqURL, options);
    }

    /**
     * Get a JSON object that contains a list of completed search terms for a given partial search term.
     * The list is sorted by Tenor's AI and the number of results decreases as Tenor's AI becomes more certain.
     * 
     * @param q A search string
     * @param options Other parameters for the Autocomplete endpoint
     * 
     * @see https://developers.google.com/tenor/guides/endpoints#autocomplete
     */
    async getAutocomplete(q: string, options: Omit<Obs<TenorSearchSuggestionsParameters>, 'q'> = {
        country: 'US',
        locale: 'en_US',
        limit: 20,
    }): Promise<TenorAutocompleteResponse> {
        const reqURL = new URL(this.baseUrl + 'autocomplete');
        reqURL.searchParams.append('q', q);

        return this.fetch
            <
                Omit<Obs<TenorAutocompleteParameters>, 'q'>,
                TenorAutocompleteResponse
            >(reqURL, options);
    }

    /**
     * Get a JSON object that contains a list of the current trending search terms. Tenor's AI updates the list hourly.
     * 
     * @param options Other parameters for the Trending search terms endpoint
     * 
     * @see https://developers.google.com/tenor/guides/endpoints#trending-search
     */
    async getTrendingSearchTerms(options: Obs<TenorTrendingSearchTermsParameters> = {
        country: 'US',
        locale: 'en_US',
        limit: 20,
    }): Promise<TenorAutocompleteResponse> {
        const reqURL = new URL(this.baseUrl + 'trending_terms');

        return this.fetch
            <
                Omit<Obs<TenorSearchSuggestionsParameters>, 'q'>,
                TenorSearchSuggestionsResponse
            >(reqURL, options);
    }

    // TODO: Add register share endpoint and posts endpoint methods
}

TenorClient.init(ENV.TenorApiKey, ENV.TenorApiBaseUrl, ENV.TenorApiClientKey);