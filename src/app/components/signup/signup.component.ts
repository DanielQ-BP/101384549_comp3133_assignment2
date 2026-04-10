import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, FormGroup,
  Validators, AbstractControl, ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pass    = control.get('password');
  const confirm = control.get('confirmPassword');
  if (pass && confirm && pass.value !== confirm.value) {
    confirm.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  if (confirm?.hasError('passwordMismatch') && pass?.value === confirm?.value) {
    confirm.setErrors(null);
  }
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSnackBarModule, MatProgressSpinnerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirm   = true;

  constructor(
    private fb: FormBuilder, private auth: AuthService,
    private router: Router,  private snackBar: MatSnackBar,
  ) {
    this.signupForm = this.fb.group({
      username:        ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMatchValidator });
  }

  get username()        { return this.signupForm.get('username')!; }
  get email()           { return this.signupForm.get('email')!; }
  get password()        { return this.signupForm.get('password')!; }
  get confirmPassword() { return this.signupForm.get('confirmPassword')!; }

  hasError(field: string, error: string): boolean {
    const c = this.signupForm.get(field);
    return !!(c && c.hasError(error) && (c.dirty || c.touched));
  }

  onSubmit(): void {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.invalid || this.loading) return;
    this.loading = true;
    const { username, email, password } = this.signupForm.value;
    this.auth.signup(username, email, password).subscribe({
      next: () => {
        this.snackBar.open('Account created! Welcome aboard.', '', { duration: 3000, panelClass: ['snack-success'] });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Signup failed. Please try again.', 'Dismiss', { duration: 4000, panelClass: ['snack-error'] });
      },
    });
  }
}
