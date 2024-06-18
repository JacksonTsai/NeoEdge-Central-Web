import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
  public sizeMax = input<string | null>(null);
  public accept = input<string | null>(null);
  public fileInfo = signal<IItServiceCaFile | null>(null);
  public acceptText = computed<string>(() => {
    if (!this.accept()) return '';
    const arr = this.accept()
      .split(',')
      .map((ext) => ext.slice(1));
    const result = arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
    return result;
  });

  private onChange: (value: IItServiceCaFile) => void;
  private onTouched: () => void;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    if (!event) return;
    const file = event && event.item(0);
    const reader = new FileReader();
    reader.onload = (e) => {
      this.fileInfo.set({
        file: file,
        name: file.name,
        content: reader.result
      });
      this.onChange(this.fileInfo());
      this.onTouched();
    };
    reader.readAsText(file);
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

  public onBlur(): void {
    this.onTouched();
  }
}
