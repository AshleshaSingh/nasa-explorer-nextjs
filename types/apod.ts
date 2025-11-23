// types/apod.ts

// defining the backend returns:
export interface ApodResponse {
    date: string;
    title: string;
    explanation: string;
    url: string; // the main image/video URL
    hdurl?: string; // NASA may provide an HD version
    media_type: "image" | "video";
    copyright?: string; // sometimes response can include copyright
}

// defining the form input type
export interface ApodFormData {
    date: string;
}