import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-add-gateway-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-gateway-dialog.component.html',
  styleUrl: './add-gateway-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddGatewayDialogComponent {}
