import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { ApiClient } from '../../core/api/api.client';

interface SongItem {
  id: string;
  title: string;
  artist?: string;
  key?: string;
}

@Component({
  standalone: true,
  imports: [NgFor],
  template: `
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Songs</h2>
      <div class="card-shell" *ngFor="let song of songs">
        <p class="font-medium">{{ song.title }}</p>
        <p class="text-sm text-slate-500">{{ song.artist || 'Unknown artist' }} • Key {{ song.key || '?' }}</p>
      </div>
    </section>
  `
})
export class SongsComponent {
  private api = inject(ApiClient);
  songs: SongItem[] = [];

  constructor() {
    this.api.get<SongItem[]>('/songs').subscribe({
      next: (res) => (this.songs = res.data ?? []),
      error: () => (this.songs = [])
    });
  }
}
