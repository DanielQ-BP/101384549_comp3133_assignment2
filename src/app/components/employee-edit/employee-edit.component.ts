import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NavbarComponent,
  ],
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
})
export class EmployeeEditComponent implements OnInit {
  form!: FormGroup;
  employee = signal<Employee | null>(null);
  loading = signal(true);
  saving = signal(false);
  photoPreview: string | null = null;
  employeeId!: string;

  genders = ['Male', 'Female', 'Other'];
  departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];
  designations = ['Software Engineer', 'Senior Engineer', 'Manager', 'Director', 'Analyst', 'Designer', 'Intern', 'Lead'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadEmployee();
  }

  initForm(): void {
    this.form = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name:  ['', [Validators.required, Validators.minLength(2)]],
      email:      ['', [Validators.required, Validators.email]],
      gender:     ['', Validators.required],
      salary:     ['', [Validators.required, Validators.min(1000)]],
      department: ['', Validators.required],
      designation:['', Validators.required],
      date_of_joining: ['', Validators.required],
      employee_photo: [''],
    });
  }

  loadEmployee(): void {
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (emp) => {
        this.employee.set(emp);
        this.photoPreview = emp.employee_photo || null;

        // Add employee's actual dept/designation to lists if not already there
        if (emp.department && !this.departments.includes(emp.department)) {
          this.departments = [emp.department, ...this.departments];
        }
        if (emp.designation && !this.designations.includes(emp.designation)) {
          this.designations = [emp.designation, ...this.designations];
        }

        // Parse date safely — handle ISO string or plain date string
        let parsedDate: Date | string = '';
        if (emp.date_of_joining) {
          const d = new Date(emp.date_of_joining);
          parsedDate = isNaN(d.getTime()) ? '' : d;
        }

        this.form.patchValue({
          first_name:      emp.first_name,
          last_name:       emp.last_name,
          email:           emp.email,
          gender:          emp.gender,
          salary:          emp.salary,
          department:      emp.department,
          designation:     emp.designation,
          date_of_joining: parsedDate,
          employee_photo:  emp.employee_photo || '',
        });

        this.loading.set(false);
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Dismiss', {
          duration: 4000,
          panelClass: ['snack-error'],
        });
        this.router.navigate(['/employees']);
      },
    });
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
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
    if (this.form.invalid || this.saving()) return;

    this.saving.set(true);
    const formValue = { ...this.form.value };

    // Convert Date object to ISO date string
    if (formValue.date_of_joining instanceof Date) {
      formValue.date_of_joining = formValue.date_of_joining.toISOString().split('T')[0];
    }

    formValue.salary = parseFloat(formValue.salary);

    this.employeeService.updateEmployee(this.employeeId, formValue).subscribe({
      next: (emp) => {
        this.snackBar.open(`${emp.first_name}'s record has been updated!`, '', {
          duration: 3000,
          panelClass: ['snack-success'],
        });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.saving.set(false);
        this.snackBar.open(err.message, 'Dismiss', {
          duration: 4000,
          panelClass: ['snack-error'],
        });
      },
    });
  }
}
