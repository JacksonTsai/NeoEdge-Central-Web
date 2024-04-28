import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'ne-multi-select-chips',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    JsonPipe,
    NgIf,
    NgFor
  ],
  template: `
    <mat-form-field appearance="outline" floatLabel="always">
      <mat-label>{{ label() }}</mat-label>
      <mat-select [formControl]="selectCtrl" multiple>
        <mat-select-trigger>
          <mat-chip-set>
            <mat-chip *ngFor="let chip of selectCtrl.value" [removable]="true" (removed)="onRemovedChip(chip)">
              {{ chip }}
              <mat-icon matChipRemove svgIcon="icon:close"></mat-icon>
            </mat-chip>
          </mat-chip-set>
        </mat-select-trigger>

        <mat-option *ngFor="let option of options" [value]="option">{{ option }}</mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styleUrl: './ne-multi-select-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NeMultiSelectChipsComponent),
      multi: true
    }
  ]
})
export class NeMultiSelectChipsComponent implements OnInit, ControlValueAccessor {
  label = input('');
  selectCtrl = new UntypedFormControl([]);
  options: string[] = [];

  form!: FormGroup;

  registerOnTouched!: (fn) => void;
  change!: (value) => void;

  onRemovedChip(item: string) {
    const selected = this.selectCtrl.value as string[];
    const newSelected = selected.filter((d) => d !== item);
    this.selectCtrl.setValue(newSelected);
  }

  ngOnInit() {
    this.selectCtrl.valueChanges.subscribe((data) => {
      this.change(data);
    });
  }

  writeValue(data: string[]) {
    this.options = [...data];
  }

  registerOnChange(fn: any) {
    this.change = fn;
  }

  onChange() {
    if (this.change) {
      this.change(this.form.value);
    }
  }
}
