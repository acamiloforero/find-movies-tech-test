import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TheMoviesService } from '../../core/services/the-movies.service';
import { Router, NavigationEnd } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../core/pipes/pipes.module';
import { TransferState } from '@angular/core';
import { Swiper } from 'swiper';
import { Movie } from '../../core/interface/movie';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let movieService: jasmine.SpyObj<TheMoviesService>;
  let router: Router;
  let routerEventsSubject: Subject<any>;

  beforeEach(waitForAsync(() => {
    const movieServiceSpy = jasmine.createSpyObj('TheMoviesService', ['getAllMovies', 'getAllSeries', 'getPremieres']);
  
    movieServiceSpy.getAllMovies.and.returnValue(of([])); 
    movieServiceSpy.getAllSeries.and.returnValue(of([]));
    movieServiceSpy.getPremieres.and.returnValue(of([]));
  
    routerEventsSubject = new Subject<any>();
  
    TestBed.configureTestingModule({
      imports: [CommonModule, PipesModule, HomeComponent],
      providers: [
        { provide: TheMoviesService, useValue: movieServiceSpy },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate'), events: routerEventsSubject.asObservable() } },
        TransferState
      ]
    }).compileComponents();
  
    movieService = TestBed.inject(TheMoviesService) as jasmine.SpyObj<TheMoviesService>;
    router = TestBed.inject(Router);
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    routerEventsSubject.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial data from localStorage', () => {
    const savedMovies = [{ Title: 'Test Movie', imdbID: 'tt1234567' }];
    const savedSeries = [{ Title: 'Test Series', imdbID: 'tt7654321' }];
    const savedPremieres = [{ Title: 'Test Premiere', imdbID: 'tt1122334' }];

    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'moviesList') return JSON.stringify(savedMovies);
      if (key === 'seriesList') return JSON.stringify(savedSeries);
      if (key === 'premieresList') return JSON.stringify(savedPremieres);
      return null;
    });

    component.ngOnInit();

    expect(component.moviesList).toEqual(savedMovies);
    expect(component.seriesList).toEqual(savedSeries);
    expect(component.premieres).toEqual(savedPremieres);
    expect(component.isLoading).toBe(false);
  });

  it('should initialize Swiper after view init', () => {
    spyOn(component, 'initSwiper').and.callThrough();

    component.ngAfterViewInit();

    expect(component.initSwiper).toHaveBeenCalled();
    expect(component.swiper).toBeDefined();
  });

  it('should set active tab correctly', () => {
    component.setActiveTab('series');
    expect(component.activeTab).toBe('series');

    component.setActiveTab('movies');
    expect(component.activeTab).toBe('movies');
  });

  it('should load more content based on active tab', () => {
    spyOn(component, 'moreLoadMovies');
    spyOn(component, 'moreLoadSeries');
    spyOn(component, 'moreLoadPremieres');

    component.activeTab = 'movies';
    component.moreLoadContent();
    expect(component.moreLoadMovies).toHaveBeenCalled();

    component.activeTab = 'series';
    component.moreLoadContent();
    expect(component.moreLoadSeries).toHaveBeenCalled();

    component.activeTab = 'premieres';
    component.moreLoadContent();
    expect(component.moreLoadPremieres).toHaveBeenCalled();
  });

  it('should navigate to movie detail on movie click', () => {
    const movie = { imdbID: 'tt1234567' };
    component.onResultMovie(movie as Movie);

    expect(router.navigate).toHaveBeenCalledWith(['/movie', 'tt1234567']);
  });

  it('should unsubscribe from router events on destroy', () => {
    spyOn(component.routerSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.routerSubscription.unsubscribe).toHaveBeenCalled();
  });

});
