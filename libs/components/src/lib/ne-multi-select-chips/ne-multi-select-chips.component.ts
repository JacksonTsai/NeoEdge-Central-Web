import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';

export interface ISelectedItem {
  id: number;
  label: string;
  value?: any;
}

export type TMultiSelectResultType = 'ALL' | 'COUNT';

@Component({
  selector: 'ne-multi-select-chips',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    JsonPipe,
    NgIf,
    NgFor
  ],
  template: `
    <mat-form-field appearance="outline" floatLabel="always">
      <mat-label>{{ label() }}</mat-label>
      <mat-select [formControl]="selectCtrl" [panelClass]="{ 'has-search': useSearch() }" multiple #select>
        <mat-select-trigger>
          @switch (resultView()) {
            @case ('COUNT') {
              @if (selectCtrl.value.length === options().length) {
                <span>Selected All</span>
              } @else if (selectCtrl.value.length) {
                <span>{{ selectCtrl.value.length }} item{{ selectCtrl.value.length > 1 ? 's' : '' }} selected</span>
              }
            }
            @default {
              <mat-chip-set>
                <mat-chip *ngFor="let chip of selectCtrl.value" [removable]="true" (removed)="onRemovedChip(chip)">
                  {{ chip?.value || chip?.label }}
                  <mat-icon matChipRemove svgIcon="icon:close"></mat-icon>
                </mat-chip>
              </mat-chip-set>
            }
          }
        </mat-select-trigger>
        @if (useSearch()) {
          <mat-form-field class="multi-select-search" appearance="outline" subscriptSizing="dynamic">
            <input matInput placeholder="Search" [formControl]="filterCtrl" />
            @if (filterCtrl.value) {
              <button matSuffix mat-icon-button aria-label="Clear" (click)="filterCtrl.setValue('')">
                <mat-icon svgIcon="icon:close"></mat-icon>
              </button>
            }
          </mat-form-field>
        }
        @if (useSelectAll()) {
          <div class="select-all">
            <mat-checkbox
              color="primary"
              [checked]="checkAllSelection('checked')"
              [indeterminate]="checkAllSelection('indeterminate')"
              (change)="toggleAllSelection($event.checked)"
            >
              Select All
            </mat-checkbox>
          </div>
        }
        <mat-option *ngFor="let option of optionsFilter()" [value]="option">{{ option.label }}</mat-option>
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
  @ViewChild('select') select: MatSelect;
  useSearch = input<boolean>(false);
  useSelectAll = input<boolean>(false);
  resultView = input<TMultiSelectResultType>('ALL');
  label = input('');
  selectCtrl = new UntypedFormControl([]);
  filterCtrl = new UntypedFormControl();
  allSelected = false;
  options = input<ISelectedItem[]>([]);
  optionsFilter = signal<ISelectedItem[]>([]);

  onChange!: (value: ISelectedItem[]) => void;
  onTouched!: (value) => void;

  onRemovedChip(item: string) {
    const selected = this.selectCtrl.value as string[];
    const newSelected = selected.filter((d) => d !== item);
    this.selectCtrl.setValue(newSelected);
  }

  search(value: string) {
    const filter = value.toLowerCase();
    return this.options().filter((option) => option.label.toLowerCase().includes(filter));
  }

  toggleAllSelection(checked) {
    this.allSelected = checked;
    if (checked) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }

  checkAllSelection(type: 'checked' | 'indeterminate'): boolean {
    if (!this.selectCtrl.value.length) return false;
    if (type === 'indeterminate') {
      return this.selectCtrl.value.length !== this.options().length;
    } else {
      return this.selectCtrl.value.length === this.options().length;
    }
  }

  ngOnInit() {
    this.optionsFilter.set(this.options());
    this.selectCtrl.valueChanges.subscribe((d) => {
      this.change();
    });
    this.filterCtrl.valueChanges.subscribe((value) => {
      this.optionsFilter.set(this.search(value));
    });
  }

  writeValue(data: ISelectedItem[]) {
    this.selectCtrl.setValue(data.map((d) => this.options().find((v) => v.id == d.id)));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  change() {
    if (this.onChange) {
      this.onChange(this.selectCtrl.value);
    }
  }
}
