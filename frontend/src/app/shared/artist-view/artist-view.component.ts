import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MusicService } from '../content/music.service';

@Component({
  selector: 'app-artist-view',
  templateUrl: './artist-view.component.html',
  styleUrls: ['./artist-view.component.css']
})
export class ArtistViewComponent implements OnInit {
  artistId = '';
  albums: any[] = [];
  loading = true;
  error = '';
  artistName = '';
  artistBio = '';

  constructor(
      private route: ActivatedRoute,
      private musicService: MusicService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.artistId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.artistId) {
      this.error = 'Artist not found.';
      this.loading = false;
      return;
    }

    this.musicService.getArtistAlbums(this.artistId).subscribe({
      next: (res: any) => {
        this.albums = res.albums || [];
        this.artistName = res.artistName || 'Artist';
        this.artistBio = res.artistBio || '';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching artist albums:', err);
        this.error = 'Failed to load albums.';
        this.loading = false;
      }
    });
  }

  getAlbumCover(album: any): string {
    return album.cover || `assets/album-covers/${album.id}.jpg` || 'assets/default-cover.png';
  }

  openAlbum(album: any): void {
    this.router.navigate(['/user/album', album.id]);
  }
}
