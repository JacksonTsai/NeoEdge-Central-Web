import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-create-message-schema',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-message-schema.component.html',
  styleUrl: './create-message-schema.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateMessageSchemaComponent {}
