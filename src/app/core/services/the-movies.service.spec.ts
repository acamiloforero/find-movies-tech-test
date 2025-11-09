import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TheMoviesService } from './the-movies.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('TheMoviesService', () => {
  let service: TheMoviesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TheMoviesService]
    });
    service = TestBed.inject(TheMoviesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#searchMovies', () => {
    it('should return an error if query is less than 3 characters', () => {
      service.searchMovies('ab').subscribe({
        next: () => fail('should have failed with a query length error'),
        error: error => {
          expect(error.message).toContain('Only queries with at least 3 characters.');
        }
      });
    });

    it('should return search results for valid query', () => {
      const dummyMovies = {
        Search: [
          { Title: 'Movie 1', imdbID: 'tt1234567' },
          { Title: 'Movie 2', imdbID: 'tt7654321' }
        ]
      };

      service.searchMovies('abc').subscribe(movies => {
        expect(movies.Search.length).toBe(2);
        expect(movies.Search).toEqual(dummyMovies.Search);
      });

      const req = httpMock.expectOne(`${service['baseUrl']}?apikey=${service['apiKey']}&s=abc`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyMovies);
    });

    it('should handle errors in searchMovies', () => {
      service.searchMovies('abc').subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: HttpErrorResponse) => {
          expect(error.message).toContain('Could not recover movie search');
        }
      });

      const req = httpMock.expectOne(`${service['baseUrl']}?apikey=${service['apiKey']}&s=abc`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('#getMovieDetails', () => {
    it('should return movie details', () => {
      const dummyDetails = { Title: 'Movie 1', imdbID: 'tt1234567', Plot: 'Some plot' };

      service.getMovieDetails('tt1234567').subscribe(details => {
        expect(details).toEqual(dummyDetails);
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/?i=tt1234567&apikey=${service['apiKey']}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyDetails);
    });

    it('should handle errors in getMovieDetails', () => {
      service.getMovieDetails('tt1234567').subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: HttpErrorResponse) => {
          expect(error.message).toContain('Something went wrong with the request. Please try again later.');
        }
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/?i=tt1234567&apikey=${service['apiKey']}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('#getAllMovies', () => {
    it('should return a list of movie details', () => {
      const dummyMovies = {
        Search: [
          { Title: 'Movie 1', imdbID: 'tt1234567' },
          { Title: 'Movie 2', imdbID: 'tt7654321' }
        ]
      };

      const dummyDetails1 = { Title: 'Movie 1', imdbID: 'tt1234567', Plot: 'Some plot' };
      const dummyDetails2 = { Title: 'Movie 2', imdbID: 'tt7654321', Plot: 'Some plot' };

      service.getAllMovies(1).subscribe(details => {
        expect(details.length).toBe(2);
        expect(details).toEqual([dummyDetails1, dummyDetails2]);
      });

      const req = httpMock.expectOne(`${service['baseUrl']}?s=movie&type=movie&page=1&apikey=${service['apiKey']}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyMovies);

      const req1 = httpMock.expectOne(`${service['baseUrl']}/?i=tt1234567&apikey=${service['apiKey']}`);
      const req2 = httpMock.expectOne(`${service['baseUrl']}/?i=tt7654321&apikey=${service['apiKey']}`);

      expect(req1.request.method).toBe('GET');
      expect(req2.request.method).toBe('GET');

      req1.flush(dummyDetails1);
      req2.flush(dummyDetails2);
    });

    it('should handle errors in getAllMovies', () => {
      service.getAllMovies(1).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error: HttpErrorResponse) => {
          expect(error.message).toContain('Something went wrong with the request. Please try again later.');
        }
      });

      const req = httpMock.expectOne(`${service['baseUrl']}?s=movie&type=movie&page=1&apikey=${service['apiKey']}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  // Similar tests can be written for getAllSeries and getPremieres following the pattern above

});
