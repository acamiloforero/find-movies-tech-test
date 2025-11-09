import { Component } from '@angular/core';
import { PipesModule } from "../core/pipes/pipes.module";
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { TheMoviesService } from '../core/services/the-movies.service';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgFor } from '@angular/common';
import { Movie } from '../core/interface/movie';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    PipesModule, 
    ReactiveFormsModule,
    FormsModule, 
    HttpClientModule,
    NgIf,
    NgFor,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private searchSubject = new Subject<string>();
  title:string="FindMovies";
  searchQuery: string = '';
  searchResults: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private movieService: TheMoviesService, public router: Router) {
    this.searchSubject.pipe(
      debounceTime(500) 
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  onSearchQueryChange(query: string) {
    this.isLoading = true;
    // console.log(query)
    this.searchQuery = query;
    if (query.length >= 3) {
      this.searchSubject.next(query);
    } else if (query.length > 0 && query.length < 3) {
      this.searchResults = [];
    }else{
      this.isLoading = false;
      this.searchResults = [];
    }
  }

  onSearch() {
    
    if (this.searchQuery.length >= 3) {
      this.performSearch(this.searchQuery);
    } else {
      console.warn('You must enter a minimum of 3 characters');
    }
  }

  performSearch(query: string) {
    this.movieService.searchMovies(query).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.Search) {
          const sortedResults = (response.Search as Movie[]).sort((a: Movie, b: Movie) => {
            return parseInt(b.Year) - parseInt(a.Year);
          });
          this.searchResults = sortedResults.slice(0, 5);
          this.errorMessage = '';
        } else {
          this.searchResults = [];
          this.errorMessage = `No results found for ${this.searchQuery} phrase.`;
        }
      },
      error: () => {
        this.isLoading = false;
        this.searchResults = [];
        this.errorMessage = 'Failed to fetch movies. Please try again.';
      }
    });
  }

  onResultMovie(result:Movie){
    this.searchResults = [];
    //console.log(result)
    this.router.navigate(['/movie', result.imdbID]);
  }
}