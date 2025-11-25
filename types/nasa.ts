// types/nasa.ts

export interface ApodResponse {
  date: string;
  title: string;
  explanation: string;
  url: string;
  media_type: "image" | "video";
  hdurl?: string;
  service_version?: string;
}
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
  
