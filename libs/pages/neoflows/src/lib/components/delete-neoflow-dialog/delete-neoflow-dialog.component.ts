import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-delete-neoflow-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-neoflow-dialog.component.html',
  styleUrl: './delete-neoflow-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteNeoflowDialogComponent {}
