import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DiscoverService } from './discover.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent {

  genreControl = new FormControl('');
  typeControl = new FormControl('');
  filteredContent: any[] = [];

  constructor(private discoverService: DiscoverService, private router: Router) {}
  filterByGenre(): void {
    const genre = this.genreControl.value?.trim().toLowerCase();
    const type = (this.typeControl.value || '').toLowerCase();
    if (!genre) return;

    this.discoverService.getContentByGenre(genre, type).subscribe({
      next: (data) => {
        const items = data.items || [];
        console.log('Fetched items:', items);
        this.filteredContent = items;
      },
      error: (err) => {
        console.error('Error fetching content:', err);
      }
    });
  }

  openAlbumDetails(item: any) {
    if (item.type === 'album') {
      this.router.navigate(['/user/album', item.id]);
    }
  }

  openArtistDetails(item: any) {
    if (item.type === 'artist') {
      this.router.navigate(['/user/artists', item.id]);
    }
  }

}
