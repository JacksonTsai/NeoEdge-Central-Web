import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NeoflowsComponent } from '../../components';

@Component({
  selector: 'ne-neoflow-page',
  standalone: true,
  imports: [CommonModule, NeoflowsComponent],
  template: ` <ne-neoflows></ne-neoflows> `,
  styleUrl: './neoflows-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeoflowsPageComponent {}
