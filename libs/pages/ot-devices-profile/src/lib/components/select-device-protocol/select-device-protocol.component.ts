import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NeSupportAppsComponent } from '@neo-edge-web/components';
import { ISupportApps, ISupportAppsWithVersion } from '@neo-edge-web/models';

@Component({
  selector: 'ne-select-device-protocol',
  standalone: true,
  imports: [CommonModule, NeSupportAppsComponent],
  templateUrl: './select-device-protocol.component.html',
  styleUrl: './select-device-protocol.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDeviceProtocolComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDeviceProtocolComponent implements ControlValueAccessor {
  supportDevices = input<ISupportApps[]>();
  change: (value) => void;
  touch: (value) => void;

  get supportAppsAvailable() {
    return this.supportDevices()?.filter((v) => v.isAvailable);
  }

  get supportAppsUnavailable() {
    return this.supportDevices()?.filter((v) => !v.isAvailable);
  }

  onSelectedDevice = (event: ISupportAppsWithVersion) => {
    this.change(event);
  };

  writeValue() {
    return;
  }

  registerOnChange(fn: any) {
    this.change = fn;
  }

  registerOnTouched(fn) {
    this.touch = fn;
  }
}
