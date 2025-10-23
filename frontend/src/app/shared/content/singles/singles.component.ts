import { Component } from '@angular/core';
import { MusicService } from '../music.service';

@Component({
  selector: 'app-singles',
  templateUrl: './singles.component.html',
  styleUrl: './singles.component.css'
})
export class SinglesComponent {

  singles: any[] = [];
  nextCursor: string | null = null;
  loading = false;

  currentSong: any = null;
  audio: HTMLAudioElement | null = null;
  isPlaying = false;
  progress = 0;

  constructor(private musicService: MusicService) {}

  ngOnInit() {
    this.loadSingles();
  }

  loadSingles() {
    if (this.loading) return;
    this.loading = true;

    this.musicService.getSingles(20, this.nextCursor ?? undefined).subscribe({
      next: res => {
        const newSingles = res.singles;

        newSingles.forEach((song: any) => {
          if (song.imageKey) {
            this.musicService.getSongCoverUrl(song.id).subscribe({
              next: cover => (song.coverUrl = cover.coverUrl),
              error: () => (song.coverUrl = 'assets/default-cover.jpg')
            });
          } else {
            song.coverUrl = 'assets/default-cover.jpg';
          }
        });

        this.singles.push(...newSingles);
        console.log(this.singles);
        this.nextCursor = res.nextCursor;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading singles:', err);
        this.loading = false;
      }
    });
  }

  playSong(songId: string) {
    const song = this.singles.find(s => s.id === songId);
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
