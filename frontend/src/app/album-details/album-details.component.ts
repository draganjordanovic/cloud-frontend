import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DiscoverService} from '../discover/discover.service';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrl: './album-details.component.css'
})

export class AlbumDetailsComponent implements OnInit {
  album: any;
  songs: any[] = [];
  artists: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private discoverService: DiscoverService
  ) {}

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id');
    if (albumId) {
      this.discoverService.getAlbumById(albumId).subscribe({
        next: (data) => {
          this.album = data.album;
          this.songs = data.songs;
          this.artists = data.artists ?? [];
        },
        error: (err) => console.error('Failed to load album', err)
      });
    }
  }
}
