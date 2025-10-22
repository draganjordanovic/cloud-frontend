import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-create-song',
  templateUrl: './create-song.component.html',
  styleUrl: './create-song.component.css'
})
export class CreateSongComponent implements OnInit{
  songForm!: FormGroup;
  genres: string[] = [];
  artists: any[] = [];
  albums: any[] = [];

  selectedFile: File | null = null;
  selectedImage: File | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.songForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      genres: [[], Validators.required],
      artistIds: [[], Validators.required],
      albumId: [''],
      file: [null, Validators.required],
      image: [null, Validators.required]
    });

    this.loadArtists();
    this.loadAlbums();
  }

  loadArtists() {
    this.adminService.getArtists()
      .subscribe({
        next: (res: any) => {
            this.artists = res;
            console.log(this.artists);
        },
        error: () => this.snackBar.open('Failed to load artists', 'Close', { duration: 3000 })
      });
  }

  loadAlbums() {
    this.adminService.getAlbums()
      .subscribe({
        next: (res: any) => {
          this.albums = res.albums;
          console.log(this.albums);
        },
        error: () => this.albums = []
      });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.songForm.patchValue({ file: this.selectedFile });
    }
  }

  onImageSelect(event: any) {
    this.selectedImage = event.target.files[0];
    if (this.selectedImage) {
      this.songForm.patchValue({ image: this.selectedImage });
    }
  }

  onSubmit() {
    if (this.songForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    const { title, description, genres, artistIds, albumId } = this.songForm.value;
    const file = this.selectedFile!;
    const image = this.selectedImage;

    const genresUppercase = genres.map((g: string) => g.toUpperCase());

    this.loading = true;

    const payload = {
      title,
      description,
      genres: genresUppercase,
      artistIds,
      albumId: albumId || 'single',
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      imageFileName: image ? image.name : undefined,
      imageFileType: image ? image.type : undefined
    };

    this.adminService.createSong(payload)
      .subscribe({
        next: async (res: any) => {
          try {
            await fetch(res.uploadUrl, { method: 'PUT', body: file });
            if (image && res.imageUploadUrl) {
              await fetch(res.imageUploadUrl, { method: 'PUT', body: image });
            }
            this.snackBar.open('Song uploaded successfully!', 'Close', { duration: 3000 });
            this.songForm.reset();
          } catch {
            this.snackBar.open('Error uploading files to S3', 'Close', { duration: 3000 });
          } finally {
            this.loading = false;
          }
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Error creating song', 'Close', { duration: 3000 });
        }
      });
  }
}
