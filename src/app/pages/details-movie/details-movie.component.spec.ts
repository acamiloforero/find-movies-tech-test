import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DetailsMovieComponent } from './details-movie.component';
import { TheMoviesService } from '../../core/services/the-movies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DetailsMovieComponent', () => {
  let component: DetailsMovieComponent;
  let fixture: ComponentFixture<DetailsMovieComponent>;
  let movieService: TheMoviesService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        RouterTestingModule,      
        DetailsMovieComponent     
      ],
      providers: [
        TheMoviesService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => 'tt1234567'  
            })
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsMovieComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(TheMoviesService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');  
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load movie details on init', () => {
    const dummyMovieDetails = {
      Title: 'Test Movie',
      Type: 'movie',
      Year: '2022',
      Runtime: '120 min',
      imdbRating: '8.0',
      imdbVotes: '100,000',
      Poster: 'someposter.jpg',
      Awards: 'Oscar winner',
      Genre: 'Action, Drama',
      Director: 'John Doe',
      Writer: 'Jane Doe',
      Actors: 'Actor A, Actor B',
      Country: 'USA',
      Released: '2022-01-01'
    };

    spyOn(movieService, 'getMovieDetails').and.returnValue(of(dummyMovieDetails));

    component.ngOnInit();

    expect(component.isLoading).toBe(false);
    expect(component.movieDetails).toEqual({
      ...dummyMovieDetails,
      AwardsT: "Awards & nominations",
      Gender: ['Action', 'Drama']
    });
  });

  it('should navigate to page-not-found if movie not found', () => {
    spyOn(movieService, 'getMovieDetails').and.returnValue(of({ Response: 'False', Error: 'Movie not found!' }));

    component.ngOnInit();

    expect(component.isLoading).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/page-not-found']);
  });

  it('should handle error when loading movie details', () => {
    spyOn(movieService, 'getMovieDetails').and.returnValue(throwError(() => new Error('API error')));

    component.ngOnInit();

    expect(component.isLoading).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/page-not-found']);
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.subscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
