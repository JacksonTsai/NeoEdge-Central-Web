import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-company-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyInfoComponent {}
