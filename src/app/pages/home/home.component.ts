import {
  Component,
  OnInit,
  PLATFORM_ID,
  Inject,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  effect,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HomeStore } from '../../core/stores/home.store';
import { Movie } from '../../core/interface/movie';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { PipesModule } from '../../core/pipes/pipes.module';

Swiper.use([Navigation, Pagination, Scrollbar]);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PipesModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  titleToday: string = 'Featured Today';
  titlePremier: string = 'Premieres and Announcements';
  activeTab: 'movies' | 'series' | 'premieres' = 'movies';
  swiper?: Swiper;
  routerSubscription: any;

  constructor(
    private store: HomeStore,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // Detectar cambios cuando Signals cambian
    effect(() => {
      if (!this.store.isLoading()) {
        this.cdr.detectChanges();
      }
    });
  }

  // Alias Signals para usar en template
  get moviesList() {
    return this.store.moviesList();
  }
  get seriesList() {
    return this.store.seriesList();
  }
  get premieres() {
    return this.store.premieresList();
  }
  get isLoading() {
    return this.store.isLoading();
  }

  ngOnInit(): void {
    // Inicializar datos desde localStorage o BFF
    this.store.initData(this.platformId);

    // Detectar navegación para recargar datos si están vacíos
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!this.store.hasMovies() || !this.store.hasSeries() || !this.store.hasPremieres()) {
          this.store.initData(this.platformId);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initSwiper();
    }
  }

  //Inicializar Swiper
  initSwiper() {
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 2.8,
      spaceBetween: 3.2,
      breakpoints: {
        640: { slidesPerView: 4.5, spaceBetween: 10 },
        1024: { slidesPerView: 5.5, spaceBetween: 10 },
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

  //Cambiar pestaña activa
  setActiveTab(tab: 'movies' | 'series' | 'premieres') {
    this.activeTab = tab;
  }

  //Cargar más al llegar al final del Swiper
  moreLoadContent() {
    this.store.loadMore(this.activeTab, this.platformId);
  }

  // Navegar a detalle
  onResultMovie(result: Movie) {
    this.router.navigate(['/movie', result.imdbID]);
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
