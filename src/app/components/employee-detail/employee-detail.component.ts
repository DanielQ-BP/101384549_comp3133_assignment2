import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NavbarComponent } from '../navbar/navbar.component';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    NavbarComponent,
  ],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit {
  employee = signal<Employee | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (emp) => {
        this.employee.set(emp);
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

  deleteEmployee(): void {
    const emp = this.employee();
    if (!emp) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete <strong>${emp.first_name} ${emp.last_name}</strong>? This action cannot be undone.`,
        confirmLabel: 'Delete',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.employeeService.deleteEmployee(emp._id).subscribe({
        next: () => {
          this.snackBar.open(`${emp.first_name} has been removed.`, '', {
            duration: 3000,
            panelClass: ['snack-success'],
          });
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.snackBar.open(err.message, 'Dismiss', {
            duration: 4000,
            panelClass: ['snack-error'],
          });
        },
      });
    });
  }

  getInitials(emp: Employee): string {
    return `${emp.first_name[0]}${emp.last_name[0]}`.toUpperCase();
  }
}
