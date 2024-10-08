import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-message-link-destination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-link-destination.component.html',
  styleUrl: './message-link-destination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageLinkDestinationComponent {}
