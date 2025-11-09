import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imgIcons',
  standalone: true
})
export class ImgIconsPipe implements PipeTransform {

  transform(icon: string, folder?: string): string {
    const URL = ""
    return `${URL}/${folder}/${icon}.svg`;
  }

}
