import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  effect,
  input
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IProjectByIdResp, IProjectsForUI, PROJECTS_LOADING, TableQueryForProjects } from '@neo-edge-web/models';
import { datetimeFormat } from '@neo-edge-web/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-projects',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule
  ],

  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements AfterViewInit {
  @Output() handleEditProject = new EventEmitter<IProjectsForUI | null>();
  @Output() handleDeleteProject = new EventEmitter<IProjectsForUI>();
  @Output() handlePageChange = new EventEmitter<TableQueryForProjects>();
  @Output() handleSwitchProject = new EventEmitter<IProjectsForUI>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  projects = input<IProjectByIdResp[]>(null);
  isSwitchMode = input<boolean>(false);
  page = input<number>(0);
  size = input<number>(0);
  projectsLength = input<number>(0);
  currentProject = input<number>(0);
  displayedColumns: string[] = ['no', 'name', 'customer', 'createdBy', 'createdAt', 'users', 'action'];

  isLoading = input<PROJECTS_LOADING>(PROJECTS_LOADING.NONE);
  searchCtrl = new FormControl('');
  dataSource = new MatTableDataSource<any>([]);

  isCurrentProject(element) {
    return this.currentProject() === element.id;
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.projects();
    });
  }

  onEditProject = (project?: IProjectsForUI) => {
    this.handleEditProject.emit(project ?? null);
  };

  onDeleteProject = (project: IProjectsForUI) => {
    this.handleDeleteProject.emit(project);
  };

  getFormatDate(timestamp: number) {
    return isNaN(timestamp) ? '-' : datetimeFormat(timestamp);
  }

  onSwitchProject = (project: IProjectsForUI) => {
    this.handleSwitchProject.emit(project);
  };

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap((page) => {
          this.handlePageChange.emit({ page: page.pageIndex + 1, size: page.pageSize });
        }),
        untilDestroyed(this)
      )
      .subscribe();

    this.searchCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(300),
        tap((str) => {
          if (str) {
            this.handlePageChange.emit({ page: 1, size: this.size(), name: str });
          } else {
            this.handlePageChange.emit({ page: 1, size: this.size() });
          }
        })
      )
      .subscribe();
  }
}
