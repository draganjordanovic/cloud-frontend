import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent {

  selectedGenres: string[] = [];
  genresControl = new FormControl<string[]>([], []);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  filteredContent = [
    { title: 'Song A', artist: 'Artist 1', album: 'Album X', cover: 'https://via.placeholder.com/200' },
    { title: 'Song B', artist: 'Artist 2', album: 'Album Y', cover: 'https://via.placeholder.com/200' },
    { title: 'Song C', artist: 'Artist 1', album: 'Album X', cover: 'https://via.placeholder.com/200' }
  ];

  addGenre(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.selectedGenres.includes(value)) {
      this.selectedGenres.push(value);
      this.genresControl.setValue(this.selectedGenres);
    }
    event.chipInput!.clear();
  }

  removeGenre(genre: string): void {
    this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    this.genresControl.setValue(this.selectedGenres);
  }
}
