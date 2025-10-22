import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../admin.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-create-album',
  templateUrl: './create-album.component.html',
  styleUrl: './create-album.component.css'
})
export class CreateAlbumComponent {

  albumForm!: FormGroup;
  artists: any[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.albumForm = this.fb.group({
      albumTitle: ['', Validators.required],
      description: [''],
      releaseYear: [new Date().getFullYear(), Validators.required],
      genres: [''],
      artistIds: [[], Validators.required],
      songs: this.fb.array([])
    });

    this.loadArtists();
    this.addSong();
  }
  genres: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  addGenre(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().toLowerCase();
    if (value && !this.genres.includes(value)) {
      this.genres.push(value);
    }
    event.chipInput!.clear();
    this.albumForm.patchValue({ genres: this.genres });
  }

  removeGenre(genre: string): void {
    this.genres = this.genres.filter(g => g !== genre);
    this.albumForm.patchValue({ genres: this.genres });
  }

  get songs(): FormArray {
    return this.albumForm.get('songs') as FormArray;
  }

  addSong(): void {
    const songGroup = this.fb.group({
      title: ['', Validators.required],
      file: [null, Validators.required],
      fileName: [''],
      fileType: [''],
      fileSize: [0],
      genres: [[]],
      description: ['']
    });
    this.songs.push(songGroup);
  }

  removeSong(index: number): void {
    this.songs.removeAt(index);
  }
  addSongGenre(event: any, i: number): void {
    const input = event.input;
    const value = (event.value || '').trim().toLowerCase();

    if (value) {
      const song = this.songs.at(i);
      const currentGenres = song.get('genres')?.value || [];
      if (!currentGenres.includes(value)) {
        song.get('genres')?.setValue([...currentGenres, value]);
      }
    }

    if (input) input.value = '';
  }

  removeSongGenre(songIndex: number, genre: string): void {
    const song = this.songs.at(songIndex);
    const currentGenres = song.get('genres')?.value || [];
    song.get('genres')?.setValue(currentGenres.filter((g: string) => g !== genre));
  }

  onFileSelected(event: any, i: number): void {
    const file = event.target.files[0];
    if (!file) return;

    const song = this.songs.at(i);
    song.patchValue({
      file,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });
  }

  loadArtists(): void {
    this.adminService.getArtists().subscribe({
      next: (res) => (this.artists = res),
      error: () => this.snackBar.open('Error fetching artists', 'Close', { duration: 3000 })
    });
  }

  submit(): void {
    if (this.albumForm.invalid) {
      this.snackBar.open('Please fill all required fields.', 'Close', { duration: 3000 });
      return;
    }

    const data = this.albumForm.value;
    const formattedSongs = data.songs.map((s: any) => ({
      title: s.title,
      fileName: s.fileName,
      fileType: s.fileType,
      fileSize: s.fileSize,
    genres: (s.genres || []).map((g: string) => g.toUpperCase()),
      description: s.description
    }));

    const upperGenres = this.genres.map(g => g.toUpperCase());

    const payload = {
      albumTitle: data.albumTitle,
      description: data.description,
      releaseYear: data.releaseYear,
      genres: upperGenres,
      artistIds: data.artistIds,
      songs: formattedSongs
    };

    this.isSubmitting = true;
    this.adminService.createAlbum(payload).subscribe({
      next: (res) => {
        this.snackBar.open('Album created successfully!', 'Close', { duration: 3000 });
        this.isSubmitting = false;
        this.albumForm.reset();
        this.genres = [];
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        this.snackBar.open('Error creating album.', 'Close', { duration: 3000 });
      }
    });
  }

}
