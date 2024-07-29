import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-if-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './if-action.component.html',
  styleUrl: './if-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IfActionComponent {}
