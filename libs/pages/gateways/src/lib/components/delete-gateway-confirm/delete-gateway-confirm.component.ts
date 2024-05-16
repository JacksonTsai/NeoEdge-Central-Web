import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-delete-gateway-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-gateway-confirm.component.html',
  styleUrl: './delete-gateway-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteGatewayConfirmComponent {}
