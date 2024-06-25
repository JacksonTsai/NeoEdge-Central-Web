import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-neoflows',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './neoflows.component.html',
  styleUrl: './neoflows.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeoflowsComponent {}
