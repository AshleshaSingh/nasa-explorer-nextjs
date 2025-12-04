// types/nasa.ts

/**
 * Represents a single APOD (Astronomy Picture of the Day) item
 * from NASA's APOD API.
 */
export interface ApodResponse {
  date: string;
  title: string;
  explanation: string;
  url: string;                     // main media URL
  media_type: "image" | "video";   // NASA returns "image" or "video"
  hdurl?: string;                  // optional HD image URL
  service_version?: string;        // optional API version
  copyright?: string;              // optional copyright text
}

/**
 * APOD can return either an object or an array of objects
 * depending on whether "count" or date ranges are used.
 */
export type ApodResult = ApodResponse | ApodResponse[];

/**
 * Form data used on the APOD search UI.
 */
export interface ApodFormData {
  date: string;
}

/**
 * Metadata for a single NASA image record.
 * We only keep the fields we actually display in the UI.
 */
export interface NasaImageData {
  title: string;
  description?: string;
  date_created?: string;
  nasa_id: string;
}

/**
 * Link information for a NASA image record.
 * Usually contains thumbnail or image URLs.
 */
export interface NasaImageLink {
  href: string;    // Direct URL to image/thumbnail
  rel?: string;    // e.g. "preview"
  render?: string; // e.g. "image"
}

/**
 * A single item in the NASA image collection.
 * It includes metadata ("data") and links ("links").
 */
export interface NasaImageItem {
  data: NasaImageData[];
  links?: NasaImageLink[];
}

/**
 * The "collection" object returned by NASA's image search endpoint.
 */
export interface NasaImageCollection {
  items: NasaImageItem[];
  metadata?: {
    total_hits?: number;
  };
  links?: {
    rel: string;
    href: string;
  }[];
}

/**
 * Full NASA image search response.
 */
export interface NasaImageSearchResult {
  collection: NasaImageCollection;
}
