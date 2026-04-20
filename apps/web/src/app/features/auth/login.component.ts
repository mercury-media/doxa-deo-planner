import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, PasswordModule],
  template: `
    <div class="mx-auto mt-20 max-w-md">
      <p-card header="Sign in">
        <p class="mb-4 text-sm text-slate-500">Your session stays active for 15 days.</p>
        <form class="space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <label class="mb-1 block text-sm">Email</label>
            <input pInputText class="w-full" formControlName="email" />
          </div>
          <div>
            <label class="mb-1 block text-sm">Password</label>
            <p-password styleClass="w-full" inputStyleClass="w-full" [feedback]="false" formControlName="password" />
          </div>
          <p-button type="submit" [disabled]="form.invalid || loading" label="Login" [loading]="loading" styleClass="w-full" />
        </form>
        <p *ngIf="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
      </p-card>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to login. Check credentials and try again.';
      }
    });
  }
}
