import { Component, OnInit, ViewChild, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { NavbarComponent } from '../navbar/navbar.component';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SalaryFormatPipe } from '../../pipes/salary-format.pipe';
import { InitialsPipe } from '../../pipes/initials.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    NavbarComponent,
    SalaryFormatPipe,
    InitialsPipe,
    HighlightDirective,
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = [
    'employee_photo', 'name', 'department', 'designation',
    'gender', 'salary', 'date_of_joining', 'actions',
  ];

  dataSource = new MatTableDataSource<Employee>([]);
  loading = signal(true);
  error = signal('');
  searchForm: FormGroup;
  isSearchActive = signal(false);

  // Dynamic lists populated from actual data
  departments: string[] = [];
  designations: string[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({ department: [''], designation: [''] });
  }

  ngOnInit(): void { this.loadEmployees(); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Custom filter: search across name, email, dept, designation
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      const str = `${data.first_name} ${data.last_name} ${data.email} ${data.department} ${data.designation}`.toLowerCase();
      return str.includes(filter);
    };
  }

  loadEmployees(): void {
    this.loading.set(true);
    this.error.set('');
    this.isSearchActive.set(false);
    this.searchForm.reset();

    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.dataSource.data = employees;
        // Build unique dynamic filter lists from real data
        this.departments  = [...new Set(employees.map(e => e.department).filter(Boolean))].sort();
        this.designations = [...new Set(employees.map(e => e.designation).filter(Boolean))].sort();
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  applySearch(): void {
    const { department, designation } = this.searchForm.value;
    if (!department && !designation) { this.loadEmployees(); return; }

    this.loading.set(true);
    this.isSearchActive.set(true);

    this.employeeService.searchEmployees(department || undefined, designation || undefined).subscribe({
      next: (employees) => {
        this.dataSource.data = employees;
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
        this.snackBar.open(err.message, 'Dismiss', { duration: 4000, panelClass: ['snack-error'] });
      },
    });
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.loadEmployees();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  viewDetails(id: string):   void { this.router.navigate(['/employees', id]); }
  editEmployee(id: string):  void { this.router.navigate(['/employees/edit', id]); }

  deleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete <strong>${employee.first_name} ${employee.last_name}</strong>? This action cannot be undone.`,
        confirmLabel: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.employeeService.deleteEmployee(employee._id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(e => e._id !== employee._id);
          this.snackBar.open(`${employee.first_name} ${employee.last_name} has been deleted.`, '', {
            duration: 3000, panelClass: ['snack-success'],
          });
        },
        error: (err) => {
          this.snackBar.open(err.message, 'Dismiss', { duration: 4000, panelClass: ['snack-error'] });
        },
      });
    });
  }

  getDepartmentColor(dept: string): string {
    const map: Record<string, string> = {
      Engineering: 'chip-accent', Marketing: 'chip-warning',
      Sales: 'chip-success', HR: 'chip-danger',
      Design: 'chip-accent', Product: 'chip-success',
    };
    return map[dept] || 'chip-gray';
  }
}
