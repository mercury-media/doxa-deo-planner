import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { ApiClient } from '../../core/api/api.client';

interface ScheduleItem {
  id: string;
  team: string;
  role: string;
  status: string;
}

@Component({
  standalone: true,
  imports: [NgFor],
  template: `
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Schedules</h2>
      <div class="card-shell" *ngFor="let schedule of schedules">
        <p class="font-medium">{{ schedule.team }} — {{ schedule.role }}</p>
        <p class="text-sm text-slate-500">Status: {{ schedule.status }}</p>
      </div>
    </section>
  `
})
export class SchedulesComponent {
  private api = inject(ApiClient);
  schedules: ScheduleItem[] = [];

  constructor() {
    this.api.get<ScheduleItem[]>('/schedules').subscribe({
      next: (res) => (this.schedules = res.data ?? []),
      error: () => (this.schedules = [])
    });
  }
}
