import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  effect,
  inject,
  input
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  BOOLEAN_STATUS,
  GATEWAY_LOADING,
  GATEWAY_SSH_STATUS,
  IGatewaySSHStatus,
  TGatewayStatusInfo
} from '@neo-edge-web/models';

@Component({
  selector: 'ne-gateway-remote-access',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule, MatIconModule, MatButtonModule],
  templateUrl: './gateway-remote-access.component.html',
  styleUrl: './gateway-remote-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayRemoteAccessComponent {
  @Output() handleSwitchSSHMode = new EventEmitter<GATEWAY_SSH_STATUS>();

  gatewayStatusInfo = input<TGatewayStatusInfo | null>(null);
  isConnected = input(false);
  isLoading = input<GATEWAY_LOADING>(GATEWAY_LOADING.NONE);
  sshStatus = input<IGatewaySSHStatus>(null);
  #fb = inject(FormBuilder);
  form: UntypedFormGroup;

  isWaiting = computed<boolean>(() => {
    return this.isLoading() === GATEWAY_LOADING.CONNECT_SSH || this.isLoading() === GATEWAY_LOADING.REFRESH_SSH;
  });

  logo = computed(() => {
    if (!this.gatewayStatusInfo()) {
      return '';
    }

    if (this.gatewayStatusInfo()?.gatewayIconPath) {
      return `${this.gatewayStatusInfo().gatewayIconPath}`;
    }

    if (!this.gatewayStatusInfo().ipcVendorName || !this.gatewayStatusInfo().ipcModelName) {
      return '/assets/images/default_gateway.png';
    }

    if (this.gatewayStatusInfo().isPartnerIpc === BOOLEAN_STATUS.TRUE) {
      return `/assets/images/default_${this.gatewayStatusInfo().ipcVendorName.toLowerCase()}_${this.gatewayStatusInfo().ipcModelName.replace(/\s+/g, '_')}.png`;
    } else {
      return '/assets/images/default_gateway.png';
    }
  });

  sshUrl = computed<string>(() => {
    if (!this.sshStatus() || !this.gatewayStatusInfo()) return '';

    const params = new URLSearchParams();
    const domain = window.location.origin;
    params.append('token', this.sshStatus()?.current?.token);
    params.append('gatewayName', encodeURIComponent(this.gatewayStatusInfo().name));
    params.append('gatewayImg', encodeURIComponent(`${domain}${this.logo()}`));

    return `${this.sshStatus()?.current?.sshServer}?${params.toString()}`;
  });

  get isEnabledCtrl() {
    return this.form.get('isEnabled') as UntypedFormControl;
  }

  constructor() {
    this.form = this.#fb.group({
      isEnabled: [{ value: false, disabled: !this.isConnected() }]
    });

    effect(() => {
      if (this.isConnected()) {
        this.isEnabledCtrl.enable();
      }

      if (this.isWaiting()) {
        this.isEnabledCtrl.disable();
      } else if (!this.isWaiting() && this.isConnected()) {
        this.isEnabledCtrl.enable();
      }

      if (this.sshStatus()?.current) {
        this.form.setValue({
          isEnabled: this.sshStatus().current.connectionStatus
        });
      }
    });
  }

  onChange = (event: MatSlideToggleChange): void => {
    this.handleSwitchSSHMode.emit(event.checked ? GATEWAY_SSH_STATUS.ENABLED : GATEWAY_SSH_STATUS.DISABLED);
  };
}
