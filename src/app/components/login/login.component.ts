import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSnackBarModule, MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder, private auth: AuthService,
    private router: Router,  private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required, Validators.minLength(3)]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get usernameOrEmail() { return this.loginForm.get('usernameOrEmail')!; }
  get password()        { return this.loginForm.get('password')!; }

  hasError(field: string, error: string): boolean {
    const c = this.loginForm.get(field);
    return !!(c && c.hasError(error) && (c.dirty || c.touched));
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid || this.loading) return;
    this.loading = true;
    const { usernameOrEmail, password } = this.loginForm.value;
    this.auth.login(usernameOrEmail, password).subscribe({
      next: () => {
        this.snackBar.open('Welcome back!', '', { duration: 2500, panelClass: ['snack-success'] });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Invalid credentials. Please try again.', 'Dismiss', { duration: 4000, panelClass: ['snack-error'] });
      },
    });
  }
}
