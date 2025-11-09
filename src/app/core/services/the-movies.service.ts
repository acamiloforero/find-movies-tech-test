import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TheMoviesService {
  private apiKey = 'e0a86a5d'; 
  private baseUrl = 'https://www.omdbapi.com/';

  constructor(private http: HttpClient) {}

  searchMovies(query: string): Observable<any> {
    if (query.length < 3) {
      return throwError(() => new Error('Only queries with at least 3 characters.'));
    }
    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('s', query);

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Could not recover movie search'));
      })
    );
  }

  getMovieDetails(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/?i=${id}&apikey=${this.apiKey}`) .pipe(
      catchError(this.handleError)
    );
  }

  getAllMovies(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}?s=movie&type=movie&page=${page}&apikey=${this.apiKey}`)
      .pipe(
        switchMap((response: any) => {
          const movieDetailsRequests = response.Search.map((movie: any) =>
            this.getMovieDetails(movie.imdbID)
          );
          return forkJoin(movieDetailsRequests);
        }),
        catchError(this.handleError)
      );
  }
  
  getAllSeries(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}?s=series&type=series&page=${page}&apikey=${this.apiKey}`)
    .pipe(
      switchMap((response: any) => {
        const movieDetailsRequests = response.Search.map((movie: any) =>
          this.getMovieDetails(movie.imdbID)
        );
        return forkJoin(movieDetailsRequests);
      }),
      catchError(this.handleError)
    );
  }
  
  getPremieres(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}?s=movie&y=2023&page=${page}&apikey=${this.apiKey}`)
    .pipe(
      switchMap((response: any) => {
        const movieDetailsRequests = response.Search.map((movie: any) =>
          this.getMovieDetails(movie.imdbID)
        );
        return forkJoin(movieDetailsRequests);
      }),
      catchError(this.handleError)
    );;
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong with the request. Please try again later.'));
  }
  
}
