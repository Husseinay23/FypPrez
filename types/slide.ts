export type SlideType =
  | "title"
  | "content"
  | "image"
  | "flowchart"
  | "table"
  | "comparison"
  | "model-results"
  | "results-summary";

export type SlideSection =
  | "introduction"
  | "dataset"
  | "models"
  | "results"
  | "analysis";

export interface SlideContent {
  paragraphs?: string[];
  bulletPoints?: string[];
  highlight?: string;
}

export interface ImageConfig {
  src: string;
  alt: string;
  caption?: string;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
  highlightRow?: number;
}

export interface Slide {
  id: string;
  order: number;
  type: SlideType;
  section?: SlideSection; // For section-based styling
  title?: string;
  content?: SlideContent;
  image?: ImageConfig;
  images?: ImageConfig[]; // Multiple images for model-results
  flowchart?: string; // Reference to flowchart JSON file
  table?: TableData;
  layout?: "default" | "split";
  modelName?: string; // For model-results slides
  metrics?: { [key: string]: string | number }; // For model metrics
}
