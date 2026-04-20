import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [RouterLink, RouterOutlet, ButtonModule],
  template: `
    <div class="min-h-screen">
      <header class="border-b border-slate-200 bg-white px-4 py-3">
        <div class="mx-auto flex max-w-6xl items-center justify-between">
          <h1 class="text-lg font-semibold text-brand-700">Doxa Deo Planner</h1>
          <nav class="flex items-center gap-2">
            <a routerLink="/" class="rounded px-2 py-1 hover:bg-slate-100">Dashboard</a>
            <a routerLink="/services" class="rounded px-2 py-1 hover:bg-slate-100">Services</a>
            <a routerLink="/songs" class="rounded px-2 py-1 hover:bg-slate-100">Songs</a>
            <a routerLink="/schedules" class="rounded px-2 py-1 hover:bg-slate-100">Schedules</a>
            <p-button label="Logout" severity="secondary" (onClick)="logout()" />
          </nav>
        </div>
      </header>
      <main class="mx-auto max-w-6xl p-4">
        <router-outlet />
      </main>
    </div>
  `
})
export class ShellComponent {
  private auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
