import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: 'primary' | 'warn' | 'accent';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-icon-wrap">
        <mat-icon class="dialog-icon">warning_amber</mat-icon>
      </div>
      <h2 class="dialog-title">{{ data.title }}</h2>
      <p class="dialog-message" [innerHTML]="data.message"></p>
      <div class="dialog-actions">
        <button mat-button class="btn-cancel" (click)="close(false)">Cancel</button>
        <button mat-flat-button class="btn-confirm" (click)="close(true)">
          {{ data.confirmLabel }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 32px 28px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
    }
    .dialog-icon-wrap {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(239,68,68,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }
    .dialog-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #ef4444;
    }
    .dialog-title {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.03em;
    }
    .dialog-message {
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
      max-width: 320px;
    }
    .dialog-actions {
      display: flex;
      gap: 10px;
      margin-top: 8px;
    }
    .btn-cancel {
      color: #64748b !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 10px !important;
      font-family: 'DM Sans', sans-serif !important;
      font-weight: 500 !important;
      height: 40px !important;
      padding: 0 20px !important;
    }
    .btn-confirm {
      background: #ef4444 !important;
      color: white !important;
      border-radius: 10px !important;
      font-family: 'DM Sans', sans-serif !important;
      font-weight: 500 !important;
      height: 40px !important;
      padding: 0 20px !important;
    }
  `],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
