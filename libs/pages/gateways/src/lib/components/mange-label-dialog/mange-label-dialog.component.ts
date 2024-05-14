import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-mange-label-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mange-label-dialog.component.html',
  styleUrl: './mange-label-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MangeLabelDialogComponent {}
