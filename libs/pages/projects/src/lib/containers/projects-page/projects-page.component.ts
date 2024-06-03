import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IProjectsForUI, PROJECTS_LOADING, TableQueryForProjects } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LetDirective } from '@ngrx/component';
import { DeleteProjectConfirmDialogComponent, EditProjectDialogComponent, ProjectsComponent } from '../../components';
import { ProjectsStore } from '../../stores/projects.store';

@UntilDestroy()
@Component({
  selector: 'ne-projects-page',
  standalone: true,
  imports: [CommonModule, ProjectsComponent, LetDirective],
  template: `
    @if (projects()) {
      <ne-projects
        [isSwitchMode]="isSwitchProject()"
        [projects]="projects()"
        [page]="tablePage()"
        [size]="tableSize()"
        [currentProject]="currentProject()"
        [projectsLength]="projectsLength()"
        (handleEditProject)="onEditProject($event)"
        (handleDeleteProject)="onDeleteProject($event)"
        (handlePageChange)="onPageChange($event)"
        (handleSwitchProject)="onSwitchProject($event)"
      >
      </ne-projects>
    }
  `,
  styleUrl: './projects-page.component.scss',
  providers: [ProjectsStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent {
  readonly #projectStore = inject(ProjectsStore);
  projects = this.#projectStore.projects;
  isLoading = this.#projectStore.isLoading;
  tableSize = this.#projectStore.size;
  tablePage = this.#projectStore.page;
  projectsLength = this.#projectStore.projectsLength;
  isSwitchProject = this.#projectStore.isSwitchProject;
  currentProject = this.#projectStore.currentProject;

  #dialog = inject(MatDialog);
  isSwitchMode = signal(false);

  constructor() {
    effect(
      () => {
        if (PROJECTS_LOADING.REFRESH_TABLE === this.isLoading()) {
          this.#projectStore.queryProjectsTableByPage({ size: this.tableSize(), page: this.tablePage() });
        }
      },
      { allowSignalWrites: true }
    );
  }

  onEditProject = (event?: IProjectsForUI | null) => {
    let editProjectDialogRef = this.#dialog.open(EditProjectDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { project: event, allUser: this.#projectStore.users(), projectsStore: this.#projectStore }
    });

    editProjectDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        editProjectDialogRef = undefined;
      });
  };

  onDeleteProject = (event: IProjectsForUI) => {
    let editRoleDialogRef = this.#dialog.open(DeleteProjectConfirmDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { project: event, projectsStore: this.#projectStore }
    });

    editRoleDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        editRoleDialogRef = undefined;
      });
  };

  onSwitchProject = (event) => {
    // TODO: add switch project function
  };

  onPageChange = (event: TableQueryForProjects) => {
    this.#projectStore.queryProjectsTableByPage(event);
  };
}
