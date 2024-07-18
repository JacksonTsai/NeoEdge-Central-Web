import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-license',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseComponent {}
