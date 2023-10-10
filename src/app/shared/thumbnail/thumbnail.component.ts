import { Component, OnInit, Input } from '@angular/core';
import { Media } from 'src/app/media.model';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent {
  @Input() content: Media;
  @Input() trending: boolean;

}
