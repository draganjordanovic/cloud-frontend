import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../admin.service';

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
      genres: [''],
      description: ['']
    });
    this.songs.push(songGroup);
  }

  removeSong(index: number): void {
    this.songs.removeAt(index);
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
      genres: s.genres ? s.genres.split(',').map((g: string) => g.trim()) : [],
      description: s.description
    }));

    const payload = {
      albumTitle: data.albumTitle,
      description: data.description,
      releaseYear: data.releaseYear,
      genres: data.genres ? data.genres.split(',').map((g: string) => g.trim()) : [],
      artistIds: data.artistIds,
      songs: formattedSongs
    };

    this.isSubmitting = true;
    this.adminService.createAlbum(payload).subscribe({
      next: (res) => {
        this.snackBar.open('Album created successfully!', 'Close', { duration: 3000 });
        this.isSubmitting = false;
        this.albumForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        this.snackBar.open('Error creating album.', 'Close', { duration: 3000 });
      }
    });
  }

}
