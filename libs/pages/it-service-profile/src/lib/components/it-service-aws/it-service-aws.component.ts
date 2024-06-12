import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ne-it-service-aws',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './it-service-aws.component.html',
  styleUrl: './it-service-aws.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceAwsComponent {
  #fb = inject(FormBuilder);
}
