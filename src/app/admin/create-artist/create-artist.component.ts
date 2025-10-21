import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArtistService } from '../admin.service';

@Component({
  selector: 'app-create-artist',
  templateUrl: './create-artist.component.html',
  styleUrl: './create-artist.component.css'
})
export class CreateArtistComponent {
  artistForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private snackBar: MatSnackBar
  ) {
    this.artistForm = this.fb.group({
      name: ['', Validators.required],
      bio: ['', Validators.required],
      genres: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.artistForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 2500 });
      return;
    }

    const formValue = this.artistForm.value;
    const genresArray = formValue.genres
      .split(',')
      .map((g: string) => g.trim())
      .filter((g: string) => g.length > 0);

    const payload = {
      name: formValue.name,
      bio: formValue.bio,
      genres: genresArray
    };

    this.artistService.createArtist(payload).subscribe({
      next: () => {
        this.snackBar.open('Artist added successfully!', 'Close', { duration: 2500 });
        this.artistForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error while adding artist.', 'Close', { duration: 3000 });
      }
    });
  }
  
}
