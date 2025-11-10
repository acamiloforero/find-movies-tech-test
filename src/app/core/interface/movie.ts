export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: 'movie' | 'series' | string;
  Poster: string;
  [key: string]: any;
}
