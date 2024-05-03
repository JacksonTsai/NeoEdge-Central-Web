import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IProjectsForUI } from '@neo-edge-web/models';
import { ProjectsStore } from '../../stores/projects.store';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './delete-project-confirm-dialog.component.html',
  styleUrl: './delete-project-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteProjectConfirmDialogComponent {
  dialogRef!: MatDialogRef<DeleteProjectConfirmDialogComponent>;
  data = inject<{ project: IProjectsForUI; projectsStore: ProjectsStore }>(MAT_DIALOG_DATA);

  incorrectRoleName = (control: AbstractControl): ValidationErrors | null => {
    return control.value === this.data.project.name ? null : { incorrectRoleName: true };
  };

  projectNameCtrl = new UntypedFormControl('', [Validators.required, this.incorrectRoleName]);

  onClose = () => {
    this.dialogRef.close();
  };

  onDelete = () => {
    if (this.projectNameCtrl.valid) {
      this.data.projectsStore.deleteProject({ projectId: this.data.project.id, projectName: this.data.project.name });
    }
  };
}
