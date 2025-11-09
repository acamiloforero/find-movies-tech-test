import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imgPng',
  standalone: true
})
export class ImgPngPipe implements PipeTransform {

  transform(img: string, folder?: string): string {
    const URL = ""
    return `${URL}/${folder}/${img}.png`;
  }

}
