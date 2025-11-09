import { 
  Component, OnInit, PLATFORM_ID, 
  Inject, AfterViewInit, ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { TheMoviesService } from '../../core/services/the-movies.service';
import { PipesModule } from '../../core/pipes/pipes.module';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Movie } from '../../core/interface/movie';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Subscription, forkJoin } from 'rxjs';

Swiper.use([Navigation, Pagination, Scrollbar]);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PipesModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  public routerSubscription: Subscription;
  activeTab: string = 'movies';
  moviesList: any[] = [];
  seriesList: any[] = [];
  premieres: any[] = [];
  pageMovies: number = 1;
  pageSeries: number = 1;
  pagePremieres: number = 1;
  titleToday: string = "Featured Today";
  titlePremier: string = "Premieres and Announcements";
  swiper: Swiper | undefined;
  isLoading: boolean = true;


  constructor(
    private movieService: TheMoviesService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.routerSubscription = new Subscription(); 
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedMoviesList = localStorage.getItem('moviesList');
      const savedSeriesList = localStorage.getItem('seriesList');
      const savedPremieresList = localStorage.getItem('premieresList');
  
      if (savedMoviesList && savedSeriesList && savedPremieresList) {
        this.moviesList = JSON.parse(savedMoviesList);
        this.seriesList = JSON.parse(savedSeriesList);
        this.premieres = JSON.parse(savedPremieresList);
        this.isLoading = false;
      } else {
        this.loadInitialData();
      }
    } else {
      this.loadInitialData();  // Cargar datos si no estamos en el navegador
    }
  
    this.routerSubscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.moviesList.length === 0 || this.seriesList.length === 0 || this.premieres.length === 0) {
            this.loadInitialData();
          }
        }
      })
    );
  }
  

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initSwiper();
    }
  }

  loadInitialData() {
    this.isLoading = true;
  
    forkJoin({
      movies: this.movieService.getAllMovies(this.pageMovies),
      series: this.movieService.getAllSeries(this.pageSeries),
      premieres: this.movieService.getPremieres(this.pagePremieres)
    }).subscribe({
      next: ({ movies, series, premieres }) => {
        if (movies && movies.length > 0) {
          this.moviesList = [...this.moviesList, ...movies];
        }
        if (series && series.length > 0) {
          this.seriesList = [...this.seriesList, ...series];
        }
        if (premieres && premieres.length > 0) {
          this.premieres = [...this.premieres, ...premieres];
        }
  
        // Solo almacenar en localStorage si estamos en el navegador
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('moviesList', JSON.stringify(this.moviesList));
          localStorage.setItem('seriesList', JSON.stringify(this.seriesList));
          localStorage.setItem('premieresList', JSON.stringify(this.premieres));
        }
  
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.isLoading = false;
        this.router.navigate(['/page-not-found']);
      }
    });
  }
  

  initSwiper() {
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 2.8,
      spaceBetween: 3.2,
      breakpoints: {
        640: { slidesPerView: 4.5, spaceBetween: 10 },
        1024: { slidesPerView: 5.5, spaceBetween: 10 }
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
      on: {
        reachEnd: () => this.moreLoadContent(),
      },
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  moreLoadContent() {
    if (this.activeTab === 'movies') {
      this.moreLoadMovies();
    } else if (this.activeTab === 'series') {
      this.moreLoadSeries();
    } else {
      this.moreLoadPremieres();
    }
  }

  moreLoadMovies() {
    this.pageMovies++;
    this.movieService.getAllMovies(this.pageMovies).subscribe({
      next: (movies: any[]) => {
        this.moviesList = [...this.moviesList, ...movies];
        localStorage.setItem('moviesList', JSON.stringify(this.moviesList)); // Actualizar localStorage
        this.cdr.detectChanges();
      },
      error: (err) => { 
        console.error('Error loading more movies:', err);
      }
    });
  }

  moreLoadSeries() {
    this.pageSeries++;
    this.movieService.getAllSeries(this.pageSeries).subscribe({
      next: (series: any[]) => {
        this.seriesList = [...this.seriesList, ...series];
        localStorage.setItem('seriesList', JSON.stringify(this.seriesList)); // Actualizar localStorage
        this.cdr.detectChanges();
      },
      error: (err) => { 
        console.error('Error loading more series:', err);
      }
    });
  }

  moreLoadPremieres() {
    this.pagePremieres++;
    this.movieService.getPremieres(this.pagePremieres).subscribe({
      next: (premieres: any[]) => {
        this.premieres = [...this.premieres, ...premieres];
        localStorage.setItem('premieresList', JSON.stringify(this.premieres)); // Actualizar localStorage
        this.cdr.detectChanges();
      },
      error: (err) => { 
        console.error('Error loading more premieres:', err);
      }
    });
  }

  onResultMovie(result: Movie) {
    this.router.navigate(['/movie', result.imdbID]);
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
