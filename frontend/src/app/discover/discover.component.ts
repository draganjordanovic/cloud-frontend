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
  loading = false;
  error: string | null = null;

  constructor(private discoverService: DiscoverService, private router: Router) {}

  filterByGenre(): void {
    const genre = this.genreControl.value?.trim().toLowerCase();
    const type = (this.typeControl.value || '').toLowerCase();
    if (!genre) return;

    this.loading = true;
    this.error = null;

    this.discoverService.getContentByGenre(genre, type).subscribe({
      next: (data) => {
        const items = data.items || [];
        this.filteredContent = items;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching content:', err);
        this.error = 'Failed to load content. Please try again.';
        this.loading = false;
      }
    });
  }

  openAlbumDetails(item: any) {
    if (item.type === 'album') this.router.navigate(['/user/album', item.id]);
  }

  openArtistDetails(item: any) {
    if (item.type === 'artist') this.router.navigate(['/user/artists', item.id]);
  }
}
