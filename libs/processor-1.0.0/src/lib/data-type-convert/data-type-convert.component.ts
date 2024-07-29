import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-data-type-convert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-type-convert.component.html',
  styleUrl: './data-type-convert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTypeConvertComponent {}
