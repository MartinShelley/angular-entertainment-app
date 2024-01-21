import { Component, Input } from '@angular/core';
import { MediaService } from 'src/app/shared/services/media.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {
  @Input() placeholderText: string;
  searchValue: string;

  constructor(private mediaService: MediaService) {}

  setSearchValue() {
    this.mediaService.setSearchValue(this.searchValue);
  }

  resetSearchValue() {
    this.searchValue = '';
  }
}
