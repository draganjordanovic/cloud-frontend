import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  isLoading = false;


  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private snackBar: MatSnackBar
  ) {
    this.artistForm = this.fb.group({
      name: ['', Validators.required],
      bio: ['', Validators.required],
      genres: [[], Validators.required]
    });
  }

  addGenre(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const lower = value.toLowerCase();
      const current = this.artistForm.get('genres')!.value as string[];
      const exists = current.some(g => g.toLowerCase() === lower);

      if (!exists) {
        this.artistForm.patchValue({ genres: [...current, value] });
      }
    }
    event.chipInput!.clear();
  }

  removeGenre(genre: string): void {
    const current = this.artistForm.get('genres')!.value as string[];
    this.artistForm.patchValue({
      genres: current.filter(g => g !== genre)
    });
  }

  get genresControl() {
  return this.artistForm.get('genres') as FormControl;
}


  onSubmit() {
    if (this.artistForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 2500 });
      this.artistForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const payload = this.artistForm.value;
    this.artistService.createArtist(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Artist added successfully!', 'Close', { duration: 2500 });
        this.artistForm.reset();
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error while adding artist.', 'Close', { duration: 3000 });
      }
    });
  }


}
