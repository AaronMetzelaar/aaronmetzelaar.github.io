export type MediaItem =
  | {
      kind: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
    }
  | {
      kind: "video";
      src: string;
      poster: string;
      alt: string;
      width: number;
      height: number;
    };

export type WorkItem = {
  slug: string;
  title: string;
  org?: string;
  period?: string;
  /** One deliberate line — what it is, for the Selected Work index. */
  tagline?: string;
  summary: string;
  highlights?: string[];
  tags: string[];
  href?: string;
  repo?: string;
  media?: MediaItem;
};
