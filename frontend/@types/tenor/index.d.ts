/**
 * @title Tenor API V2 typings
 * @author -_YoYo178_- (Sumit)
 * @date 21st September 2025
 * 
 * @disclaimer These typings are **UNOFFICIAL** and are entirely
 * based on the data available at:
 * - https://developers.google.com/tenor/guides/endpoints
 * - https://developers.google.com/tenor/guides/response-objects-and-errors
 */

/** === Endpoint typings === */

/**
 * Parameters for the search endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#parameters-search
 */
interface TenorSearchParameters {
    /** API key for privileged access */
    key: string;

    /** A search string */
    q: string;

    /**
     * A client-specified string that represents the integration.
     * A client key lets you use the same API key across different integrations but still be able to differentiate them.
     * For an app integration, use the same client_key value for all API calls.
     * Any client custom behavior is triggered by the pairing of the key and client_key parameters.
     * 
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default undefined
     */
    client_key?: string;

    /**
     * Comma-separated list of non-GIF content types to filter the Response Objects. By default, searchfilter returns GIF content only.
     * - `sticker` returns both static and animated sticker content.
     * - `sticker,-static` returns only animated sticker content.
     * - `sticker,static` returns only static sticker content.
     * 
     * For GIF content, either leave this blank or don't use it.
     * @default undefined
     */
    searchfilter?: 'sticker' | 'static' | '-static';

    /**
     * Specify the country of origin for the request. To do so, provide its two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'US'
     */
    country?: string;

    /**
     * Specify the default language to interpret the search string.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * You can use the country code that you provide in locale to differentiate between dialects of the given language.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'en_US'
     */
    locale?: string;

    /**
     * Specify the content safety filter level.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'off'
     */
    contentfilter?: 'off' | 'low' | 'medium' | 'high';

    /**
     * Comma-separated list of GIF formats to filter the Response Objects. By default, `media_filter` returns all formats for each Response Object.
     * 
     * 
     * Example: media_filter=gif,tinygif,mp4,tinymp4
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     */
    media_filter?: string;

    /**
     * Filter the Response Objects to only include GIFs with aspect ratios that fit within the selected range.
     *
     * - all: No constraints
     * - wide: 0.42 <= aspect ratio <= 2.36
     * - standard: 0.56 <= aspect ratio <= 1.78
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     */
    ar_range?: 'all' | 'wide' | 'standard';

    /**
     * Specify whether to randomly order the response. The default value is `false`, which orders the results by Tenor's relevancy ranking.
     * @default false
     */
    random?: boolean;

    /**
     * Fetch up to the specified number of results.
     * 
     * This value can be a maxmimum of 50.
     * @default 20
     */
    limit?: number;

    /**
     * Retrieve results that start at the position based on the given value.
     * Use a non-zero, non-empty value from next, returned by the API response, to get the next set of results.
     * pos isn't an index and might be an integer, float, or string.
     */
    pos?: string | number;
}

/**
 * Response object for the Search endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#response-format-search
 */
interface TenorSearchResponse {

    /**
     * A position identifier to use with the next API query, through the pos field, to retrieve the next set of results.
     * If there are no further results, next returns an empty string.
    */
    next: string;

    /**
     * An array of GIF Response Objects that contains the most relevant content for the requested search term. The content is sorted by its relevancy Rank.
     */
    results: TenorGIFResponseObject[];
}

/**
 * Parameters for the featured endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#parameters-featured
 */
interface TenorFeaturedParameters {
    /** API key for privileged access */
    key: string;

    /**
     * A client-specified string that represents the integration.
     * A client key lets you use the same API key across different integrations but still be able to differentiate them.
     * For an app integration, use the same client_key value for all API calls.
     * Any client custom behavior is triggered by the pairing of the key and client_key parameters.
     * 
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default undefined
     */
    client_key?: string;

    /**
     * Comma-separated list of non-GIF content types to filter the Response Objects. By default, searchfilter returns GIF content only.
     * - `sticker` returns both static and animated sticker content.
     * - `sticker,-static` returns only animated sticker content.
     * - `sticker,static` returns only static sticker content.
     * 
     * For GIF content, either leave this blank or don't use it.
     * @default undefined
     */
    searchfilter?: 'sticker' | 'static' | '-static';

    /**
     * Specify the country of origin for the request. To do so, provide its two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'US'
     */
    country?: string;

    /**
     * Specify the default language to interpret the search string.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * You can use the country code that you provide in locale to differentiate between dialects of the given language.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'en_US'
     */
    locale?: string;

    /**
     * Comma-separated list of GIF formats to filter the Response Objects. By default, `media_filter` returns all formats for each Response Object.
     * 
     * 
     * Example: media_filter=gif,tinygif,mp4,tinymp4
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     */
    media_filter?: TenorContentFormats;

    /**
     * Filter the Response Objects to only include GIFs with aspect ratios that fit within the selected range.
     *
     * - all: No constraints
     * - wide: 0.42 <= aspect ratio <= 2.36
     * - standard: 0.56 <= aspect ratio <= 1.78
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     */
    ar_range?: 'all' | 'wide' | 'standard';

    /**
     * Specify the content safety filter level.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'off'
     */
    contentfilter?: 'off' | 'low' | 'medium' | 'high';

    /**
     * Fetch up to the specified number of results.
     * 
     * This value can be a maxmimum of 50.
     * @default 20
     */
    limit?: number;

    /**
     * Retrieve results that start at the position based on the given value.
     * Use a non-zero, non-empty value from next, returned by the API response, to get the next set of results.
     * pos isn't an index and might be an integer, float, or string.
     */
    pos?: string | number;
}

/**
 * Response object for the featured endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#response-format-featured
 */
interface TenorFeaturedResponse {
    /**
     * The locale for which the search string was parsed for.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * The country code in this field can be used to differentiate between dialects of the given language.
     * @note UNOFFICIAL - This property is not documented on Tenor's official documentation but is present in the API call.
     */
    locale: string;

    /** A position identifier to use with the next API query, through the pos field, to retrieve the next set of results.
     * If there are no further results, `next` returns an empty string.
     */
    next: string;

    /** An array of Featured GIF Response Objects. */
    results: TenorGIFResponseObject[];
}

/**
 * Parameters for the categories endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#parameters-categories
 */
interface TenorCategoriesParameters {
    /** API key for privileged access */
    key: string;

    /**
     * A client-specified string that represents the integration.
     * A client key lets you use the same API key across different integrations but still be able to differentiate them.
     * For an app integration, use the same client_key value for all API calls.
     * Any client custom behavior is triggered by the pairing of the key and client_key parameters.
     * 
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default undefined
     */
    client_key?: string;

    /**
     * Specify the country of origin for the request. To do so, provide its two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'US'
     */
    country?: string;

    /**
     * Specify the default language to interpret the search string.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * You can use the country code that you provide in locale to differentiate between dialects of the given language.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'en_US'
     */
    locale?: string;

    /**
     * Specify the content safety filter level.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'off'
     */
    contentfilter?: 'off' | 'low' | 'medium' | 'high';

    /**
     * Determines the type of categories returned.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'featured'
     */
    type?: 'featured' | 'trending';

}

/**
 * Response object for the categories endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#response-format-categories
 */
interface TenorCategoriesResponse {
    /**
     * The locale for which the search string was parsed for.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * The country code in this field can be used to differentiate between dialects of the given language.
     * @note UNOFFICIAL - This property is not documented on Tenor's official documentation but is present in the API call.
     */
    locale: string;

    /**
     * An array of {@link TenorCategory} where the name field has been translated into the locale language.
     */
    tags: TenorCategory[];
}

/**
 * Parameters for the search suggestions endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#parameters-categsearch-suggestionsories
 */
interface TenorSearchSuggestionsParameters {
    /** API key for privileged access */
    key: string;

    /** A search string */
    q: string;

    /**
     * A client-specified string that represents the integration.
     * A client key lets you use the same API key across different integrations but still be able to differentiate them.
     * For an app integration, use the same client_key value for all API calls.
     * Any client custom behavior is triggered by the pairing of the key and client_key parameters.
     * 
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default undefined
     */
    client_key?: string;

    /**
     * Specify the country of origin for the request. To do so, provide its two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'US'
     */
    country?: string;

    /**
     * Specify the default language to interpret the search string.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * You can use the country code that you provide in locale to differentiate between dialects of the given language.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'en_US'
     */
    locale?: string;

    /**
     * Fetch up to the specified number of results.
     * 
     * This value can be a maxmimum of 50.
     * @default 20
     */
    limit?: number;
}

/**
 * Response object for the search suggestions endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#response-format-search-suggestions
 */
interface TenorSearchSuggestionsResponse {
    /**
     * The locale for which the search string was parsed for.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * The country code in this field can be used to differentiate between dialects of the given language.
     * @note UNOFFICIAL - This property is not documented on Tenor's official documentation but is present in the API call.
     */
    locale: string;

    /**
     * An array of suggested search terms
     */
    results: string[];
}

/**
 * Parameters for the Autocomplete endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#parameters-autocomplete
 */
interface TenorAutocompleteParameters {
    /** API key for privileged access */
    key: string;

    /** A search string */
    q: string;

    /**
     * A client-specified string that represents the integration.
     * A client key lets you use the same API key across different integrations but still be able to differentiate them.
     * For an app integration, use the same client_key value for all API calls.
     * Any client custom behavior is triggered by the pairing of the key and client_key parameters.
     * 
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default undefined
     */
    client_key?: string;

    /**
     * Specify the country of origin for the request. To do so, provide its two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'US'
     */
    country?: string;

    /**
     * Specify the default language to interpret the search string.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * You can use the country code that you provide in locale to differentiate between dialects of the given language.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'en_US'
     */
    locale?: string;

    /**
     * Fetch up to the specified number of results.
     * 
     * This value can be a maxmimum of 50.
     * @default 20
     */
    limit?: number;
}

/**
 * Response object for the Autocomplete endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#response-format-autocomplete
 */
interface TenorAutocompleteResponse {
    /**
     * The locale for which the search string was parsed for.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * The country code in this field can be used to differentiate between dialects of the given language.
     * @note UNOFFICIAL - This property is not documented on Tenor's official documentation but is present in the API call.
     */
    locale: string;

    /**
     * An array of suggested search terms
     */
    results: string[];
}

/**
 * Parameters for the Trending search terms endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#parameters-trending-search
 */
interface TenorTrendingSearchTermsParameters {
    /** API key for privileged access */
    key: string;

    /**
     * A client-specified string that represents the integration.
     * A client key lets you use the same API key across different integrations but still be able to differentiate them.
     * For an app integration, use the same client_key value for all API calls.
     * Any client custom behavior is triggered by the pairing of the key and client_key parameters.
     * 
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default undefined
     */
    client_key?: string;

    /**
     * Specify the country of origin for the request. To do so, provide its two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'US'
     */
    country?: string;

    /**
     * Specify the default language to interpret the search string.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * You can use the country code that you provide in locale to differentiate between dialects of the given language.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'en_US'
     */
    locale?: string;

    /**
     * Fetch up to the specified number of results.
     * 
     * This value can be a maxmimum of 50.
     * @default 20
     */
    limit?: number;
}

/**
 * Response object for the Trending search terms endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#response-format-trending-search
 */
interface TenorTrendingSearchTermsResponse {
    /**
     * The locale for which the search string was parsed for.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * The country code in this field can be used to differentiate between dialects of the given language.
     * @note UNOFFICIAL - This property is not documented on Tenor's official documentation but is present in the API call.
     */
    locale: string;

    /**
     * An array of suggested search terms. The terms are sorted by their Trending Rank.
     */
    results: string[];
}

/**
 * Parameters for the Register share endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#parameters-register-share
 */
interface TenorRegisterShareParameters {
    /** API key for privileged access */
    key: string;

    /** The id of a Response Object */
    id: string;

    /**
     * A client-specified string that represents the integration.
     * A client key lets you use the same API key across different integrations but still be able to differentiate them.
     * For an app integration, use the same client_key value for all API calls.
     * Any client custom behavior is triggered by the pairing of the key and client_key parameters.
     * 
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default undefined
     */
    client_key?: string;

    /**
     * Specify the country of origin for the request. To do so, provide its two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'US'
     */
    country?: string;

    /**
     * Specify the default language to interpret the search string.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * You can use the country code that you provide in locale to differentiate between dialects of the given language.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default 'en_US'
     */
    locale?: string;

    /**
     * Fetch up to the specified number of results.
     * 
     * This value can be a maxmimum of 50.
     * @default 20
     */
    limit?: number;

    /**
     * The search string that leads to this share.
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default undefined
     */
    q: string;
}

/**
 * Response object for the Register share endpoint.
 * 
 * @note **This is an empty object**
 * 
 * There's no formal response to the Register Share endpoint.
 * Developers can check the HTTPS response code to determine whether they've successfully reached the API.
 * 
 * @see https://developers.google.com/tenor/guides/endpoints#response-format-register-share
 */
interface TenorRegisterShareResponse { }

/**
 * Parameters for the Posts endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#parameters-posts
 */
interface TenorPostsParameters {
    /** API key for privileged access */
    key: string;

    /**
     * A comma-separated list of Response Object IDs.
     * 
     * Doesn't have a default value, and the maximum value is 50.
     * @default undefined
     */
    ids: string;

    /**
     * A client-specified string that represents the integration.
     * A client key lets you use the same API key across different integrations but still be able to differentiate them.
     * For an app integration, use the same client_key value for all API calls.
     * Any client custom behavior is triggered by the pairing of the key and client_key parameters.
     * 
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     * @default undefined
     */
    client_key?: string;

    /**
     * Comma-separated list of GIF formats to filter the Response Objects. By default, `media_filter` returns all formats for each Response Object.
     * 
     * 
     * Example: media_filter=gif,tinygif,mp4,tinymp4
     * @note While this property is optional, it is **strongly recommended** to provide a value for this field.
     */
    media_filter?: string;
}

/**
 * Response object for the Posts endpoint.
 * @see https://developers.google.com/tenor/guides/endpoints#response-format-posts
 */
interface TenorPostsResponse {
    /**
     * The locale for which the search string was parsed for.
     * 
     * First two letters `xx` are the language's {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-1} language code.
     * While the optional last two letters `_YY` are the two-letter {@link https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes ISO 3166-1} country code.
     * 
     * The country code in this field can be used to differentiate between dialects of the given language.
     * @note UNOFFICIAL - This property is not documented on Tenor's official documentation but is present in the API call.
     */
    locale: string;

    /**
     * An array of Response Objects that correspond to those passed in the ids list.
     */
    results: string[];
}

/** === Response object typings === */

/**
 * Represents a GIF object returned by the Tenor API
 * @see https://developers.google.com/tenor/guides/response-objects-and-errors#response-object
 */
interface TenorGIFResponseObject {

    /** A Unix timestamp that represents when this post was created. */
    created: number;

    /**
     * Returns `true` if this post contains audio.
     * @note Only video formats support audio. The GIF image file format can't contain audio information.
    */
    hasaudio: boolean;

    /** Tenor result identifier */
    id: string;

    /** A dictionary with a content format as the key and a Media Object as the value. */
    media_formats: { [K in TenorContentFormats]: TenorMediaObject };

    /** An array of tags for the post */
    tags: string[];

    /** The title of the post */
    title: string;

    /**
     * A textual description of the content.
     * @note We recommend that you use content_description for user accessibility features.
     */
    content_description: string;

    /** The full URL to view the post on tenor.com */
    itemurl: string;

    /** Returns `true` if this post contains captions. */
    hascaption?: boolean;

    /** 
     * Comma-separated list to signify whether the content is a sticker or static image,
     * has audio, or is any combination of these. If `sticker` and `static`
     * aren't present, then the content is a GIF. A blank `flags` field signifies
     * a GIF without audio.
     */
    flags: string[];

    /** The most common background pixel color of the content */
    bg_color?: string;

    /** A short URL to view the post on tenor.com */
    url: string;

    /**
     * @todo This property is not listed in Tenor's Documentation, but is present in the API responses, the purpose of this field is unknown.
     */
    content_description_source: string;
}

/** 
 * Represents a category object
 * @see https://developers.google.com/tenor/guides/response-objects-and-errors#category-object
 */
interface TenorCategory {
    /** The search term that corresponds to the category. The search term is translated to match the locale of the corresponding request. */
    searchterm: string;
    /** The search URL to request if the user selects the category */
    path: string;
    /** A URL to the media source for the category's example GIF */
    image: string;
    /** Category name to overlay over the image. The name is translated to match the locale of the corresponding request. */
    name: string;
}

/** 
 * Represents a media object, Tenor API usually returns GIF objects with media objects for all content formats by default.
 * 
 * This behavior can be overrided by using the `media_filter` parameter in the API requests.
 * 
 * @see https://developers.google.com/tenor/guides/response-objects-and-errors#media-object 
 */
interface TenorMediaObject {

    /** A URL to the media source */
    url: string;

    /** Width and height of the media in pixels */
    dims: [number, number];

    /** Represents the time in seconds for one loop of the content. If the content is static, the duration is set to 0. */
    duration: number;

    /** Size of the file in bytes */
    size: number;

    /**
     * @todo This property is not listed in Tenor's Documentation, but is present in the API responses, the purpose of this field is unknown.
     */
    preview?: string;
}

/**
 * This type represents the various content formats supported by the Tenor API and are used in the `media_filter` parameter.
 * 
 * @see https://developers.google.com/tenor/guides/response-objects-and-errors#content-formats
 */
type TenorContentFormats =
    'preview' |
    'gif' |
    'mediumgif' |
    'tinygif' |
    'nanogif' |
    'mp4' |
    'loopedmp4' |
    'tinymp4' |
    'nanomp4' |
    'webm' |
    'tinywebm' |
    'nanowebm' |
    'webp_transparent' |
    'tinywebp_transparent' |
    'nanowebp_transparent' |
    'gif_transparent' |
    'tinygif_transparent' |
    'nanogif_transparent'