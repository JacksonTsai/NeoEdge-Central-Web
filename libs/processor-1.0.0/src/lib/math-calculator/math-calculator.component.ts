import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-math-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './math-calculator.component.html',
  styleUrl: './math-calculator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MathCalculatorComponent {}
