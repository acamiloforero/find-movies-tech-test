import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//pages
import { HomeComponent } from './pages/home/home.component';
import { DetailsMovieComponent } from './pages/details-movie/details-movie.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: "full",
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    { 
        path: 'page-not-found', 
        component: PageNotFoundComponent 
    },
    { 
      path: 'movie/:id', 
      component: DetailsMovieComponent
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
