import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  computed,
  forwardRef,
  inject,
  input,
  signal
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  Validator,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { IOtDevice, ITableQuery, OT_DEVICES_TABLE_MODE } from '@neo-edge-web/models';
import { OtDevicesComponent } from '@neo-edge-web/ot-devices-profile';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-select-data-provider',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatIconModule,
    OtDevicesComponent
  ],
  templateUrl: './select-data-provider.component.html',
  styleUrl: './select-data-provider.component.scss',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDataProviderComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SelectDataProviderComponent), multi: true }
  ],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDataProviderComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {
  @Output() handleAddDeviceFromProfile = new EventEmitter();
  @Output() handleRemoveDeviceFromNeoFlow = new EventEmitter<{ otDeviceName: string }>();
  @Output() handleDetailDeviceFromNeoFlow = new EventEmitter<IOtDevice<any>>();
  @Output() handleAddNewDevice = new EventEmitter();

  addedOtList = input<IOtDevice<any>[]>([]);
  #fb = inject(FormBuilder);
  pageNumber = signal(1);
  pageSize = signal(10);
  searchCtrl = new UntypedFormControl('');
  searchStr = signal<string>('');
  otDeviceTableMode = OT_DEVICES_TABLE_MODE;
  form: FormGroup;
  change: (value) => void;
  touch: (value) => void;

  otDevices = computed(() => {
    const addedOtBySearch = this.addedOtList().filter((d) => d.name.includes(this.searchStr()));
    const startIndex = (this.pageNumber() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();

    return addedOtBySearch.slice(startIndex, endIndex);
  });

  writeValue(v) {
    console.log(v);
  }

  validate() {
    return this.form.invalid ? { formError: 'error' } : null;
  }

  registerOnChange(fn: any) {
    this.change = fn;
  }

  registerOnTouched(fn) {
    this.touch = fn;
  }

  onPageChange = (event: ITableQuery) => {
    if (event?.page) {
      this.pageNumber.set(event.page);
    }

    if (event?.size) {
      this.pageSize.set(event.size);
    }
  };

  onChange() {
    if (this.change) {
      this.change(this.form.value);
    }
  }

  onAddNewDevice = () => {
    this.handleAddNewDevice.emit();
  };

  onDetailDeviceFromNeoFlow = (event) => {
    this.handleDetailDeviceFromNeoFlow.emit(event);
  };

  onRemoveDeviceFromNeoFlow = ({ otDeviceName }) => {
    this.handleRemoveDeviceFromNeoFlow.emit({ otDeviceName });
  };

  onAddDeviceFromProfile = () => {
    this.handleAddDeviceFromProfile.emit();
  };

  ngOnInit() {
    this.form = this.#fb.group({
      otDevices: [[], [Validators.required]]
    });

    this.form.valueChanges.subscribe(() => {
      this.onChange();
    });

    this.searchCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(300),
        tap((str) => {
          this.searchStr.set(str);
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.onChange();
  }
}
