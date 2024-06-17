import { ChangeDetectionStrategy, Component, HostListener, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { img2Base64 } from '@neo-edge-web/utils';

@Component({
  selector: 'ne-upload-preview-image',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './ne-upload-preview-image.component.html',
  styleUrl: './ne-upload-preview-image.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NeUploadPreviewImageComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeUploadPreviewImageComponent implements ControlValueAccessor {
  isEditMode = input(false);
  imagePreview = signal('');
  change: (value) => void;
  touch: (value) => void;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    if (!event) return;
    const file = event && event.item(0);
    const img = file;
    img2Base64(img).subscribe((d) => {
      this.imagePreview.set(`data:${file.type};base64,${d}`);
      this.onChange(img);
    });
  }

  get isSvgIcon() {
    return this.imagePreview().match('^icon:');
  }

  writeValue(imagePath: string) {
    this.imagePreview.set(imagePath);
  }

  registerOnChange(fn: any) {
    this.change = fn;
  }

  registerOnTouched(fn) {
    this.touch = fn;
  }

  onChange(image: File) {
    if (this.change) {
      this.change(image);
    }
  }
}
