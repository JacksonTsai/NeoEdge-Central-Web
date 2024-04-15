import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-permission-dialog.component.html',
  styleUrl: './user-permission-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPermissionDialogComponent {}
