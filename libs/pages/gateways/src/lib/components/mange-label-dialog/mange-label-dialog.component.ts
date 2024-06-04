import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IGatewayLabels, IProjectLabel } from '@neo-edge-web/models';
import { gatewayLabelColor } from '../../configs/gateway-lable.config';
import { GatewaysStore } from '../../stores/gateways.store';

@Component({
  selector: 'ne-mange-label-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './mange-label-dialog.component.html',
  styleUrl: './mange-label-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MangeLabelDialogComponent implements OnInit {
  dialogRef!: MatDialogRef<MangeLabelDialogComponent>;
  data = inject<{ gwStore: GatewaysStore }>(MAT_DIALOG_DATA);
  formArr!: UntypedFormArray;
  gwLabel = this.data.gwStore.labels();
  @ViewChild('content') content: ElementRef;
  readonly MAX_LABEL_COUNT = 10;
  gwColorLabel = gatewayLabelColor.map((d) => ({ ...d, isUse: this.gwLabel.some((v) => v.colorCode === d.colorCode) }));
  #fb = inject(FormBuilder);

  labelFg = (index: number) => {
    return this.formArr.at(index) as UntypedFormGroup;
  };

  labelNameCtrl = (index: number) => {
    return this.labelFg(index).get('name') as UntypedFormControl;
  };

  labelColorCodeCtrl = (index: number) => {
    return this.labelFg(index).get('colorCode') as UntypedFormControl;
  };

  onSubmit = () => {
    if (this.formArr.valid) {
      const editLabelPayload: IProjectLabel[] = [...this.formArr.value.map((d) => ({ ...d, name: d.name.trim() }))];
      this.data.gwStore.editProjectLabels({ payload: { labels: editLabelPayload } });
    }
  };

  scrollToBottom = () => {
    this.content.nativeElement.scrollTop =
      this.content.nativeElement.scrollHeight - this.content.nativeElement.offsetHeight;
  };

  setNewLabel = () => {
    this.formArr.push(this.addLabel());
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  };

  nextLabelColorIndex = (): number => {
    const nextIndex = this.gwColorLabel.findIndex((d) => !d.isUse);
    if (nextIndex > -1) {
      this.gwColorLabel[nextIndex].isUse = true;
      return nextIndex;
    }
    return 0;
  };

  removeLabel = (index: number) => {
    const notUseColorLabel = this.labelColorCodeCtrl(index).value;
    const labelIndex = this.gwColorLabel.findIndex((d) => d.colorCode === notUseColorLabel);
    if (labelIndex !== -1) {
      this.gwColorLabel[labelIndex].isUse = false;
    }
    this.formArr.removeAt(index);
  };

  addLabel = (data?: IGatewayLabels) => {
    return new UntypedFormGroup({
      id: new UntypedFormControl(data?.id ?? null),
      name: new UntypedFormControl(data?.name ?? '', [Validators.required]),
      colorCode: new UntypedFormControl(data?.colorCode ?? this.gwColorLabel[this.nextLabelColorIndex()].colorCode)
    });
  };

  ngOnInit(): void {
    this.formArr = this.#fb.array([
      ...this.gwLabel.map((data) => {
        return this.addLabel(data);
      })
    ]);
  }
}
