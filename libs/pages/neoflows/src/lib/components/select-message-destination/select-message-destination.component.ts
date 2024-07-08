import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IItService } from '@neo-edge-web/models';

@Component({
  selector: 'ne-select-message-destination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-message-destination.component.html',
  styleUrl: './select-message-destination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectMessageDestinationComponent {
  itProfileList = input<IItService[]>([]);
}
