import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../music.service';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrl: './album-details.component.css'
})
export class AlbumDetailsComponent {

 album: any = null;
  songs: any[] = [];

  currentSong: any = null;
  audio: HTMLAudioElement | null = null;
  isPlaying = false;
  progress = 0;

  constructor(private route: ActivatedRoute, private musicService: MusicService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.musicService.getAlbumDetails(id).subscribe(res => {
      this.album = res.album;
      this.songs = res.songs;

      this.songs.forEach((song: any) => {
        if (song.imageKey) {
          this.musicService.getSongCoverUrl(song.id).subscribe({
            next: cover => (song.coverUrl = cover.coverUrl),
            error: () => (song.coverUrl = 'assets/default-cover.jpg')
          });
        } else {
          song.coverUrl = 'assets/default-cover.jpg';
        }
      });
    });
  }

  playSong(songId: string) {
    const song = this.songs.find(s => s.id === songId);
    if (!song) return;

    if (this.currentSong && this.currentSong.id === songId) {
      if (this.audio && this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio?.play();
        this.isPlaying = true;
      }
      return;
    }

    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.musicService.getSongStreamUrl(songId).subscribe({
      next: res => {
        this.audio = new Audio(res.streamUrl);
        this.audio.play();
        this.currentSong = song;
        this.isPlaying = true;
        this.progress = 0;

        this.audio.ontimeupdate = () => {
          if (this.audio && this.audio.duration > 0) {
            this.progress = (this.audio.currentTime / this.audio.duration) * 100;
          }
        };

        this.audio.onended = () => {
          this.isPlaying = false;
          this.progress = 0;
        };
      },
      error: err => console.error('Error playing song:', err)
    });
  }

  togglePlay() {
    if (!this.audio) return;
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play();
      this.isPlaying = true;
    }
  }
}
