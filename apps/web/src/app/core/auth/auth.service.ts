import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { ApiClient } from '../api/api.client';

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    church_id: string;
    role: string;
  };
}

const TOKEN_KEY = 'doxa_access_token';
const EXPIRES_AT_KEY = 'doxa_access_token_expires_at';
const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiClient);
  private router = inject(Router);

  private tokenValue = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private expiresAt = signal<number>(Number(localStorage.getItem(EXPIRES_AT_KEY) || 0));

  readonly token = computed(() => this.tokenValue());
  readonly isAuthenticated = computed(() => Boolean(this.tokenValue()) && Date.now() < this.expiresAt());

  login(email: string, password: string) {
    return this.api.post<LoginResponse>('/auth/login', { email, password }).pipe(
      map((res) => res.data),
      tap((payload) => this.persistSession(payload.accessToken))
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    this.tokenValue.set(null);
    this.expiresAt.set(0);
    void this.router.navigate(['/login']);
  }

  ensureValidSession() {
    if (!this.isAuthenticated()) {
      this.logout();
    }
  }

  private persistSession(token: string) {
    const expiresAt = Date.now() + FIFTEEN_DAYS_MS;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
    this.tokenValue.set(token);
    this.expiresAt.set(expiresAt);
  }
}
