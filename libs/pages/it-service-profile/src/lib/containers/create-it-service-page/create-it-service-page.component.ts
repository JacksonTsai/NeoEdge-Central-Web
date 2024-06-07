import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-create-it-service-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-it-service-page.component.html',
  styleUrl: './create-it-service-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateItServicePageComponent {}
