import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ApiEnvelope<T> {
  data: T;
  meta?: unknown;
  error?: { code: string; message: string } | null;
}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private http = inject(HttpClient);
  private baseUrl = '/api/v1';

  get<T>(path: string) {
    return this.http.get<ApiEnvelope<T>>(`${this.baseUrl}${path}`);
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<ApiEnvelope<T>>(`${this.baseUrl}${path}`, body);
  }
}
