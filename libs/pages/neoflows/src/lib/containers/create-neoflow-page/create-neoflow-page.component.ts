import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-create-neoflow-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-neoflow-page.component.html',
  styleUrl: './create-neoflow-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateNeoflowPageComponent {}
