import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export enum MATH_UNIT {
  Addition = 'Addition',
  Subtraction = 'Subtraction',
  Multiplication = 'Multiplication',
  Division = 'Division',
  Pow = 'Pow',
  Absolute = 'Absolute'
}

@Component({
  selector: 'ne-math-calculator',
  standalone: true,
  imports: [CommonModule, CdkDrag, MatInputModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './math-calculator.component.html',
  styleUrl: './math-calculator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MathCalculatorComponent {
  @Output() clickEmit = new EventEmitter();
  mathUnit = MATH_UNIT;
  // + - X / (pow n ,1/n) abs

  valueCtrl = new UntypedFormControl('');

  click() {
    this.clickEmit.emit('click 17');
  }
}
