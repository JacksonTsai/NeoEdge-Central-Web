import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ne-addition-unit',
  standalone: true,
  imports: [CommonModule, CdkDrag, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './addition-unit.component.html',
  styleUrl: './addition-unit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionUnitComponent {
  valueCtrl = new UntypedFormControl('[input]+100');
}
