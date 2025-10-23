import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DiscoverService } from './discover.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent {

  genreControl = new FormControl('');
  filteredContent: any[] = [];

  constructor(private discoverService: DiscoverService) {}

  filterByGenre(): void {
    const genre = this.genreControl.value?.trim();
    if (!genre) return;

    this.discoverService.getContentByGenre(genre).subscribe({
      next: (data) => {
        console.log('Data from API:', data);
        this.filteredContent = data;
      },
      error: (err) => {
        console.error('Error fetching content:', err);
      }
    });
  }
}
