import { Injectable, signal, computed } from '@angular/core';
import { TheMoviesService } from '../services/the-movies.service';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeStore {
  constructor(private moviesService: TheMoviesService) {}

  // 🔹 Estado
  readonly moviesList = signal<any[]>([]);
  readonly seriesList = signal<any[]>([]);
  readonly premieresList = signal<any[]>([]);
  readonly pageMovies = signal<number>(1);
  readonly pageSeries = signal<number>(1);
  readonly pagePremieres = signal<number>(1);
  readonly isLoading = signal<boolean>(true);
  readonly isLoadingMore = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly hasMovies = computed(() => this.moviesList().length > 0);
  readonly hasSeries = computed(() => this.seriesList().length > 0);
  readonly hasPremieres = computed(() => this.premieresList().length > 0);

  // 🔹 Inicialización
  initData(platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      const savedMovies = localStorage.getItem('moviesList');
      const savedSeries = localStorage.getItem('seriesList');
      const savedPremieres = localStorage.getItem('premieresList');

      if (savedMovies && savedSeries && savedPremieres) {
        this.moviesList.set(JSON.parse(savedMovies));
        this.seriesList.set(JSON.parse(savedSeries));
        this.premieresList.set(JSON.parse(savedPremieres));
        this.isLoading.set(false);
        return;
      }
    }

    this.loadInitialData(platformId);
  }

  async loadInitialData(platformId: Object) {
    this.isLoading.set(true);
    try {
      const [movies, series, premieres] = await Promise.all([
        firstValueFrom(this.moviesService.getAllMovies(this.pageMovies())),
        firstValueFrom(this.moviesService.getAllSeries(this.pageSeries())),
        firstValueFrom(this.moviesService.getPremieres(this.pagePremieres())),
      ]);

      this.moviesList.set(movies || []);
      this.seriesList.set(series || []);
      this.premieresList.set(premieres || []);

      if (isPlatformBrowser(platformId)) {
        localStorage.setItem('moviesList', JSON.stringify(this.moviesList()));
        localStorage.setItem('seriesList', JSON.stringify(this.seriesList()));
        localStorage.setItem('premieresList', JSON.stringify(this.premieresList()));
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
      this.error.set('Error loading data');
    } finally {
      this.isLoading.set(false);
    }
  }

  // 🔹 Cargar más
  async loadMore(tab: 'movies' | 'series' | 'premieres', platformId: Object) {
    if (this.isLoadingMore()) return;
    this.isLoadingMore.set(true);

    try {
      let data: any[] = [];
      switch (tab) {
        case 'movies':
          this.pageMovies.update((p) => p + 1);
          data = await firstValueFrom(this.moviesService.getAllMovies(this.pageMovies()));
          this.moviesList.set([...this.moviesList(), ...data]);
          if (isPlatformBrowser(platformId)) localStorage.setItem('moviesList', JSON.stringify(this.moviesList()));
          break;

        case 'series':
          this.pageSeries.update((p) => p + 1);
          data = await firstValueFrom(this.moviesService.getAllSeries(this.pageSeries()));
          this.seriesList.set([...this.seriesList(), ...data]);
          if (isPlatformBrowser(platformId)) localStorage.setItem('seriesList', JSON.stringify(this.seriesList()));
          break;

        case 'premieres':
          this.pagePremieres.update((p) => p + 1);
          data = await firstValueFrom(this.moviesService.getPremieres(this.pagePremieres()));
          this.premieresList.set([...this.premieresList(), ...data]);
          if (isPlatformBrowser(platformId))
            localStorage.setItem('premieresList', JSON.stringify(this.premieresList()));
          break;
      }
    } catch (err) {
      console.error(`Error loading more ${tab}:`, err);
      this.error.set(`Error loading more ${tab}`);
    } finally {
      this.isLoadingMore.set(false);
    }
  }

  // 🔹 Limpiar cache
  clearCache() {
    localStorage.removeItem('moviesList');
    localStorage.removeItem('seriesList');
    localStorage.removeItem('premieresList');
    this.moviesList.set([]);
    this.seriesList.set([]);
    this.premieresList.set([]);
  }
}
