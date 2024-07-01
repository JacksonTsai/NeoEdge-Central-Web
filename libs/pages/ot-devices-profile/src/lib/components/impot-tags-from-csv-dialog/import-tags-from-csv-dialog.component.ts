import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NeUploadFileComponent } from '@neo-edge-web/components';
import { csvToObj } from '@neo-edge-web/utils';
import { checkCsvTagsFormat } from '../../utils/csv-tag-validator.helper';

@Component({
  selector: 'ne-import-tags-from-csv-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, NeUploadFileComponent, ReactiveFormsModule],
  templateUrl: './import-tags-from-csv-dialog.component.html',
  styleUrl: './import-tags-from-csv-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportTagsFromCsvDialogComponent implements OnInit {
  #dialogRef = inject(MatDialogRef<ImportTagsFromCsvDialogComponent>);
  data = inject<any>(MAT_DIALOG_DATA);
  tagFileCtrl = new UntypedFormControl('', [Validators.required]);
  importCsvResult = signal([]);
  csvContent = signal([]);

  onClose = () => {
    this.#dialogRef.close();
  };

  onImport = () => {
    if (this.tagFileCtrl.valid && !this.importCsvResult().length) {
      this.#dialogRef.close(csvToObj(this.tagFileCtrl.value.content));
    }
  };

  ngOnInit(): void {
    this.tagFileCtrl.valueChanges.subscribe((d) => {
      if (d?.content) {
        this.importCsvResult.set([]);
        const csvContent = csvToObj(d.content);
        this.importCsvResult.set(checkCsvTagsFormat(csvContent));
        this.csvContent.set(csvContent);
      }
    });
  }
}
