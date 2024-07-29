import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-byte-split',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './byte-split.component.html',
  styleUrl: './byte-split.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ByteSplitComponent {}
