import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-tumbling-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tumbling-window.component.html',
  styleUrl: './tumbling-window.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TumblingWindowComponent {}
