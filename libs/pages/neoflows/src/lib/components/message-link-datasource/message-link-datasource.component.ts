import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-message-link-datasource',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-link-datasource.component.html',
  styleUrl: './message-link-datasource.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageLinkDatasourceComponent {}
