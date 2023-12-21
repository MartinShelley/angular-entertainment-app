import { Pipe, PipeTransform } from '@angular/core';

/*

Simple pipe that sorts the labelling for Movies. 
There are different variations of the label for Movies in
the back end data & for the labels in the Figma file.

*/

@Pipe({
  name: 'mediaCategoryLabel'
})
export class MediaCategoryLabelPipe implements PipeTransform {

  transform(value: string): string {
    if(value === 'Movie') {
      return 'Movies';
    }
    return 'TV Series';
  }

}