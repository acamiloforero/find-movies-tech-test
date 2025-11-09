import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TheMoviesService } from '../../core/services/the-movies.service';
import { PipesModule } from "../../core/pipes/pipes.module";
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-movie',
  standalone: true,
  imports: [
    CommonModule,
    PipesModule,
  ],
  templateUrl: './details-movie.component.html',
  styleUrl: './details-movie.component.scss'
})
export class DetailsMovieComponent implements OnInit, OnDestroy {
  movieDetails: any;
  isLoading: boolean = true;
  movieId$:Observable<any>;
  public subscription: Subscription = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private movieService: TheMoviesService,
    private router: Router
  ) {
    this.movieId$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return this.movieService.getMovieDetails(id!); 
      })
    );
  }
  ngOnInit(): void {
    this.subscription=this.movieId$.subscribe({
      next: (response) => {
        if (response.Response === "False" || response.Error) {
          this.isLoading = false;
          this.router.navigate(['/page-not-found']);
          return
        }
          this.movieDetails = response;
          this.movieDetails.AwardsT= "Awards & nominations";
          this.movieDetails.Gender=this.movieDetails.Genre
          ? this.movieDetails.Genre.split(',').map((genre: string) => genre.trim())
          : [];
          this.isLoading = false;
          //console.log(this.movieDetails)
        
      },
      error: (err) => {
        console.error('Error occurred:', err.message);
        this.isLoading = false;
        this.router.navigate(['/page-not-found']);
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
  }
}