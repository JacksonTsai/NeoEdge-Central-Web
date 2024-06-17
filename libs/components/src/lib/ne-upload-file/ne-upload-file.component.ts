import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ne-upload-file',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './ne-upload-file.component.html',
  styleUrl: './ne-upload-file.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeUploadFileComponent {
  showTip = input(true);
  sizeMax = input<string | null>(null);
  accept = input<string | null>(null);

  selectedFile = signal<File | null>(null);
  fileConent = signal<string | ArrayBuffer | null>(null);

  acceptText = computed<string>(() => {
    if (!this.accept()) return '';
    const arr = this.accept()
      .split(',')
      .map((ext) => ext.slice(1));
    const result = arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
    return result;
  });

  fileInputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
    this.selectedFile.set(fileInputEvent.target.files[0]);
    if (this.selectedFile()) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fileConent.set(reader.result);
      };
      reader.readAsText(this.selectedFile());
    }
  }
}
