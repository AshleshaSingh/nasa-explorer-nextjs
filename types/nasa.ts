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
