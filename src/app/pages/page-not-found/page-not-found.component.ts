import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from "../../core/pipes/pipes.module";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    CommonModule,
    PipesModule,
    RouterModule
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {
  title:string = "Ooops...";
  text: string = "Something went wrong.";
  titleButton: string = "Refresh";
}
