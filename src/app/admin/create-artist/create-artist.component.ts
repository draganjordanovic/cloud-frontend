import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ArtistService } from '../admin.service';

@Component({
  selector: 'app-create-artist',
  templateUrl: './create-artist.component.html',
  styleUrls: ['./create-artist.component.scss']
})
export class CreateArtistComponent {
  artistForm: FormGroup;
  genres: string[] = [];

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private snackBar: MatSnackBar
  ) {
    this.artistForm = this.fb.group({
      name: ['', Validators.required],
      bio: ['', Validators.required]
    });
  }

  addGenre(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();

  if (value) {
    const lower = value.toLowerCase();
    const exists = this.genres.some(g => g.toLowerCase() === lower);

    if (!exists) {
      this.genres.push(value);
    }
  }

  event.chipInput!.clear();
}


  removeGenre(genre: string): void {
    const index = this.genres.indexOf(genre);
    if (index >= 0) {
      this.genres.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.artistForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 2500 });
      return;
    }

    const formValue = this.artistForm.value;
    const payload = {
      name: formValue.name,
      bio: formValue.bio,
      genres: this.genres
    };

    this.artistService.createArtist(payload).subscribe({
      next: () => {
        this.snackBar.open('Artist added successfully!', 'Close', { duration: 2500 });
        this.artistForm.reset();
        this.genres = [];
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error while adding artist.', 'Close', { duration: 3000 });
      }
    });
  }
}
