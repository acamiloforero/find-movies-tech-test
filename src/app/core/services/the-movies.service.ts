import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TheMoviesService {
  private baseUrl = '/api'; // apunta al BFF

  constructor(private http: HttpClient) {}

  searchMovies(query: string): Observable<any> {
    if (!query || query.trim().length < 3) {
      return throwError(() => new Error('Only queries with at least 3 characters.'));
    }

    // Ahora apuntamos al BFF con query param 'query'
    const params = new HttpParams().set('query', query);

    return this.http.get<any>(`${this.baseUrl}/search`, { params }).pipe(
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Could not recover movie search'));
      }),
    );
  }
  getMovieDetails(id: string): Observable<any> {
    if (!id) return throwError(() => new Error('Movie ID is required.'));
    return this.http
      .get<any>(`${this.baseUrl}/movies/${id}`)
      .pipe(catchError((error) => throwError(() => new Error(error?.message || 'Error fetching movie details'))));
  }

  getAllMovies(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http
      .get<any>(`${this.baseUrl}/movies`, { params })
      .pipe(catchError((error) => throwError(() => new Error(error?.message || 'Error fetching movies'))));
  }

  getAllSeries(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http
      .get<any>(`${this.baseUrl}/series`, { params })
      .pipe(catchError((error) => throwError(() => new Error(error?.message || 'Error fetching series'))));
  }

  getPremieres(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http
      .get<any>(`${this.baseUrl}/premieres`, { params })
      .pipe(catchError((error) => throwError(() => new Error(error?.message || 'Error fetching premieres'))));
  }
}
