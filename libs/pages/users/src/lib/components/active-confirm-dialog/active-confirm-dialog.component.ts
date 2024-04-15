import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-confirm-dialog.component.html',
  styleUrl: './active-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveConfirmDialogComponent {}
