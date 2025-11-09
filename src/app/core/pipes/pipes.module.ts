import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgPngPipe } from './img-png.pipe';
import { ImgIconsPipe } from './img-icons.pipe'

@NgModule({
  declarations: [],
  exports: [ImgPngPipe, ImgIconsPipe],
  imports: [
    CommonModule,
    ImgPngPipe, 
    ImgIconsPipe
  ]
})
export class PipesModule { }
