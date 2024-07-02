import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  forwardRef,
  inject,
  input,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IItServiceCaFile } from '@neo-edge-web/models';

@Component({
  selector: 'ne-upload-file',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './ne-upload-file.component.html',
  styleUrl: './ne-upload-file.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NeUploadFileComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeUploadFileComponent implements ControlValueAccessor {
  #snackBar = inject(MatSnackBar);
  public maxSize = input<string | null>(null);
  public accept = input<string | null>(null);
  public isDisabled = signal(false);
  public fileInfo = signal<IItServiceCaFile | null>(null);
  public acceptDesc? = input<string>(null);

  private acceptArr = computed<string[]>(() => {
    if (!this.accept()) return [];
    return this.accept()
      .split(',')
      .map((ext) => ext.slice(1));
  });

  public acceptText = computed<string>(() => {
    if (this.acceptDesc()) {
      return this.acceptDesc();
    }
    if (!this.accept()) return '';
    const arr = this.acceptArr();
    let result = 'Support ';
    if (arr.length === 1) {
      result = result + arr[0];
    } else {
      result = result + arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
    }
    return result + ' file format';
  });

  private parseSize = computed<number | null>(() => {
    if (!this.maxSize) return null;
    const units = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824 };
    const match = this.maxSize()
      .toUpperCase()
      .match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2] as keyof typeof units;
      return value * units[unit];
    }
    return null;
  });

  private onChange: (value: IItServiceCaFile) => void;
  private onTouched: () => void;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    if (!event) return;
    const file = event && event.item(0);

    // Check file format & Check file size
    if (!this.checkFileFormat(file) || !this.checkFileSize(file)) {
      this.onChange(null);
      return;
    }

    this.setFormValue(file, '');
    const reader = new FileReader();
    reader.onload = (e) => {
      this.setFormValue(file, reader.result);
      this.onTouched();
    };
    reader.readAsText(file);
  }

  private checkFileFormat(file: File): boolean {
    if (!this.acceptArr().length) return true;
    const fileExtension = file?.name.split('.').pop()?.toLowerCase() || '';
    const result = !!this.acceptArr().includes(fileExtension);
    if (!result) {
      this.#snackBar.open(`File type ${fileExtension} is not accepted.`, 'X', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 5000
      });
    }
    return result;
  }

  private checkFileSize(file: File): boolean {
    if (!this.parseSize()) return true;
    const result = file.size <= this.parseSize();
    if (!result) {
      this.#snackBar.open(`File size exceeds the maximum limit.`, 'X', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 5000
      });
    }
    return result;
  }

  private setFormValue(file: File, content: string | ArrayBuffer): void {
    this.fileInfo.set({
      file: file,
      name: file.name,
      content: content
    });
    this.onChange(this.fileInfo());
  }

  public writeValue(value: IItServiceCaFile): void {
    this.fileInfo.set(value);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public onBlur(): void {
    this.onTouched();
  }
}
