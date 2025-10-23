import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DiscoverService } from './discover.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent {

  genreControl = new FormControl('');
  filteredContent: any[] = [];
  typeControl = new FormControl('');


  constructor(private discoverService: DiscoverService, private router: Router) { }

  filterByGenre(): void {
    const genre = this.genreControl.value?.trim().toLowerCase();
    let type = this.typeControl.value || '';
    type = type.toLowerCase();
    if (!genre) return;

    this.discoverService.getContentByGenre(genre, type).subscribe({
      next: (data) => {
        console.log('Data from API:', data);
        this.filteredContent = data.items || [];
      },
      error: (err) => {
        console.error('Error fetching content:', err);
      }
    });
  }

  openAlbumDetails(item: any) {
    if (item.type === 'album') {
      this.router.navigate(['/albums', item.id]);
    }
  }
}
