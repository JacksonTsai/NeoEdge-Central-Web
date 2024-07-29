import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-message-link-destination-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-link-destination-page.component.html',
  styleUrl: './message-link-destination-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageLinkDestinationPageComponent {}
