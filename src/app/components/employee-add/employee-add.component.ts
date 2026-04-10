import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../navbar/navbar.component';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDatepickerModule,
    MatNativeDateModule, MatSnackBarModule, MatProgressSpinnerModule,
    NavbarComponent,
  ],
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss'],
})
export class EmployeeAddComponent {
  form: FormGroup;
  loading = false;
  photoPreview: string | null = null;

  genders      = ['Male', 'Female', 'Other'];
  departments  = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];
  designations = ['Software Engineer', 'Senior Engineer', 'Manager', 'Director', 'Analyst', 'Designer', 'Intern', 'Lead'];

  constructor(
    private fb: FormBuilder, private employeeService: EmployeeService,
    private router: Router,   private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      first_name:      ['', [Validators.required, Validators.minLength(2)]],
      last_name:       ['', [Validators.required, Validators.minLength(2)]],
      email:           ['', [Validators.required, Validators.email]],
      gender:          ['', Validators.required],
      salary:          ['', [Validators.required, Validators.min(1000)]],
      department:      ['', Validators.required],
      designation:     ['', Validators.required],
      date_of_joining: ['', Validators.required],
      employee_photo:  [''],
    });
  }

  hasError(field: string, error: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.hasError(error) && (c.dirty || c.touched));
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.snackBar.open('File too large. Maximum size is 2MB.', 'Dismiss', { duration: 3000, panelClass: ['snack-error'] });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.form.patchValue({ employee_photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.photoPreview = null;
    this.form.patchValue({ employee_photo: '' });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    const val = { ...this.form.value };
    if (val.date_of_joining instanceof Date) {
      val.date_of_joining = val.date_of_joining.toISOString().split('T')[0];
    }
    val.salary = parseFloat(val.salary);
    this.employeeService.addEmployee(val).subscribe({
      next: (emp) => {
        this.snackBar.open(`${emp.first_name} ${emp.last_name} added successfully!`, '', { duration: 3000, panelClass: ['snack-success'] });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Failed to add employee.', 'Dismiss', { duration: 4000, panelClass: ['snack-error'] });
      },
    });
  }
}
