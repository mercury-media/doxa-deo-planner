import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Dashboard</h2>
      <div class="grid gap-4 md:grid-cols-3">
        <div class="card-shell">
          <p class="text-sm text-slate-500">This week</p>
          <p class="text-2xl font-semibold">3 Services</p>
        </div>
        <div class="card-shell">
          <p class="text-sm text-slate-500">Songs in library</p>
          <p class="text-2xl font-semibold">128</p>
        </div>
        <div class="card-shell">
          <p class="text-sm text-slate-500">Pending responses</p>
          <p class="text-2xl font-semibold">9</p>
        </div>
      </div>
    </section>
  `
})
export class DashboardComponent {}
