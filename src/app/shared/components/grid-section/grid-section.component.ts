import { Component, Input } from '@angular/core';
import { Media } from 'src/app/media.model';

@Component({
  selector: 'app-grid-section',
  templateUrl: './grid-section.component.html',
  styleUrls: ['./grid-section.component.scss']
})
export class GridSectionComponent {
  @Input() title?: string;
  @Input() array: Media[];

}
