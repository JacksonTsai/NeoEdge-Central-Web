import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, computed, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
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
import { MatSelectModule } from '@angular/material/select';
import { NeMultiSelectChipsComponent } from '@neo-edge-web/components';
import { IEditProjectReq, IProjectField, IProjectsForUI, User } from '@neo-edge-web/models';
import { whitespaceValidator } from '@neo-edge-web/validators';
import { ProjectsStore } from '../../stores/projects.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    NeMultiSelectChipsComponent
  ],
  templateUrl: './edit-project-dialog.component.html',
  styleUrl: './edit-project-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProjectDialogComponent implements OnInit {
  dialogRef!: MatDialogRef<EditProjectDialogComponent>;
  data = inject<{ project: IProjectsForUI | null; projectsStore: ProjectsStore; allUser: User[] }>(MAT_DIALOG_DATA);
  #fb = inject(FormBuilder);
  form!: UntypedFormGroup;
  @ViewChild('content') content: ElementRef;
  readonly MAX_CUSTOMIZE_FIELD = 10;

  allUserName = computed(() => {
    return this.data.allUser.map((d) => ({
      id: d.id,
      label: d?.name || d.account?.split('@')[0] || '-'
    }));
  });

  get isEditMode() {
    return this.data.project ? true : false;
  }

  get projectFieldsArr() {
    return this.form.get('projectFields') as UntypedFormArray;
  }

  get nameCtrl() {
    return this.form.get('name') as UntypedFormControl;
  }

  get shortNameCtrl() {
    return this.form.get('shortName') as UntypedFormControl;
  }

  projectFieldFormGroup = (index) => {
    return this.projectFieldsArr.at(index) as UntypedFormGroup;
  };

  projectFieldNameCtrl = (index) => {
    return this.projectFieldFormGroup(index).get('name') as UntypedFormControl;
  };

  projectFieldValueCtrl = (index) => {
    return this.projectFieldFormGroup(index).get('value') as UntypedFormControl;
  };

  onSubmit = () => {
    if (this.form.invalid) {
      return;
    }

    const formValue: IProjectsForUI = this.form.value;
    const payload: IEditProjectReq = { ...formValue, users: [...formValue.users.map((d) => d.id)] };

    if (this.data.project) {
      this.data.projectsStore.editProject({
        projectId: this.data.project.id,
        payload
      });
    } else {
      this.data.projectsStore.createProject(payload);
    }
  };

  onClose = () => {
    this.dialogRef.close();
  };

  addProjectFieldsFormGroup = (data?: IProjectField) => {
    return new UntypedFormGroup({
      id: new FormControl(data?.id ?? 0),
      name: new UntypedFormControl(data?.name ?? '', [Validators.required]),
      value: new UntypedFormControl(data?.value ?? '', [Validators.required])
    });
  };

  setNewProjectField = () => {
    this.projectFieldsArr.push(this.addProjectFieldsFormGroup());
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  };

  scrollToBottom = () => {
    this.content.nativeElement.scrollTop =
      this.content.nativeElement.scrollHeight - this.content.nativeElement.offsetHeight;
  };

  removeProjectField = (index) => {
    this.form.markAsDirty();
    this.projectFieldsArr.removeAt(index);
  };

  ngOnInit() {
    this.form = this.#fb.group({
      name: [this.data?.project?.name ?? '', [Validators.required, whitespaceValidator]],
      customer: [this.data?.project?.customer ?? ''],
      shortName: [this.data?.project?.shortName ?? '', [Validators.required, whitespaceValidator]],
      description: [this.data?.project?.description ?? ''],
      users: [this.data?.project ? this.data.project.users.map((d) => ({ id: d.id, label: d.name })) : []],
      projectFields: this.#fb.array(
        this.data?.project
          ? [...this.data.project.projectFields.map((data) => this.addProjectFieldsFormGroup(data))]
          : []
      )
    });
  }
}
