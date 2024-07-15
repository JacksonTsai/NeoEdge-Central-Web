import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  OnInit,
  Output,
  signal
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ItServicesComponent } from '@neo-edge-web/it-service-profile';
import { IItService, IT_SERVICE_TABLE_MODE, ITableQuery } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-select-message-destination',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatIconModule,
    ItServicesComponent
  ],
  templateUrl: './select-message-destination.component.html',
  styleUrl: './select-message-destination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectMessageDestinationComponent implements OnInit {
  @Output() handleAddItServiceFromProfile = new EventEmitter();
  @Output() handleRemoveItServiceFromNeoFlow = new EventEmitter<any>();
  @Output() handleDetailItServiceFromNeoFlow = new EventEmitter<any>();
  @Output() handleAddNewItService = new EventEmitter();

  addedItList = input<IItService[]>([]);
  searchCtrl = new UntypedFormControl('');
  searchStr = signal<string>('');
  pageNumber = signal(1);
  pageSize = signal(10);
  itServiceTableMode = IT_SERVICE_TABLE_MODE;

  itServices = computed(() => {
    const addedOtBySearch = this.addedItList().filter((d) => d.name.includes(this.searchStr()));
    const startIndex = (this.pageNumber() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();

    return addedOtBySearch.slice(startIndex, endIndex);
  });

  onPageChange = (event: ITableQuery) => {
    if (event?.page) {
      this.pageNumber.set(event.page);
    }

    if (event?.size) {
      this.pageSize.set(event.size);
    }
  };

  onAddNewItService = () => {
    this.handleAddNewItService.emit();
  };

  onAddItServiceFromProfile = () => {
    this.handleAddItServiceFromProfile.emit();
  };

  onRemoveItServiceFromNeoFlow = (it) => {
    this.handleRemoveItServiceFromNeoFlow.emit(it);
  };

  onDetailItServiceFromNeoFlow = (it) => {
    this.handleDetailItServiceFromNeoFlow.emit(it);
  };

  ngOnInit() {
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
}
