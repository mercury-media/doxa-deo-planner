import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { ApiClient } from '../../core/api/api.client';

interface ServiceItem {
  id: string;
  title: string;
  service_date: string;
  starts_at: string;
}

@Component({
  standalone: true,
  imports: [NgFor],
  template: `
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Services</h2>
      <div class="card-shell" *ngFor="let service of services">
        <p class="font-medium">{{ service.title }}</p>
        <p class="text-sm text-slate-500">{{ service.service_date }} at {{ service.starts_at }}</p>
      </div>
    </section>
  `
})
export class ServicesComponent {
  private api = inject(ApiClient);
  services: ServiceItem[] = [];

  constructor() {
    this.api.get<ServiceItem[]>('/services').subscribe({
      next: (res) => (this.services = res.data ?? []),
      error: () => (this.services = [])
    });
  }
}
