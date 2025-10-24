import { Component } from '@angular/core';
import { MusicService } from '../music.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css'
})
export class AlbumsComponent {

  albums: any[] = [];
  nextCursor: string | null = null;
  loading = false;

  constructor(private musicService: MusicService, private router: Router) { }

  ngOnInit() {
    this.loadAlbums();
  }

  loadAlbums() {
    this.loading = true;
    this.musicService.getAlbums(20, this.nextCursor ?? undefined).subscribe({
      next: res => {
        this.albums.push(...res.albums);
        this.nextCursor = res.nextCursor;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadMore() {
    if (this.nextCursor && !this.loading) {
      this.loadAlbums();
    }
  }

  openAlbum(id: string) {


    const storedGroups = localStorage.getItem('groups');
    const groups: string[] = storedGroups ? JSON.parse(storedGroups) : [];

    if (groups.includes('Admin')) {
      this.router.navigate(['admin/albums', id]);
    } else {
      this.router.navigate(['user/album', id]);
    }

  }
}
