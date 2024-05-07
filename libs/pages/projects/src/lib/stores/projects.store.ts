import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsService, UserService, UsersService } from '@neo-edge-web/global-service';
import { RouterStoreService } from '@neo-edge-web/global-store';
import { IEditProjectReq, IProjectsState, PROJECTS_LOADING, TableQueryForProjects } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, combineLatest, map, pipe, switchMap, take, tap } from 'rxjs';

const INIT_TABLE_PAGE = 1;
const INIT_TABLE_SIZE = 10;

const initialState: IProjectsState = {
  projects: [],
  users: [],
  page: INIT_TABLE_PAGE,
  size: INIT_TABLE_SIZE,
  projectsLength: 0,
  queryKey: '',
  isLoading: PROJECTS_LOADING.NONE,
  isSwitchProject: false
};

export type ProjectsStore = InstanceType<typeof ProjectsStore>;

export const ProjectsStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      dialog = inject(MatDialog),
      projectsService = inject(ProjectsService),
      usersService = inject(UsersService),
      userService = inject(UserService)
    ) => ({
      queryProjectsTableByPage: rxMethod<TableQueryForProjects>(
        pipe(
          tap(() => patchState(store, { isLoading: PROJECTS_LOADING.TABLE })),
          switchMap(({ page, size, name }) =>
            combineLatest([
              !store.isSwitchProject()
                ? projectsService.projectTable$({ page: page ?? INIT_TABLE_PAGE, size: size ?? INIT_TABLE_SIZE, name })
                : userService.userProjects$({ page: page ?? INIT_TABLE_PAGE, size: size ?? INIT_TABLE_SIZE, name }),
              usersService.users$()
            ]).pipe(
              map(([projects, users]) => {
                patchState(store, {
                  projects:
                    projects?.projects?.map((project) => ({
                      ...project,
                      users: [...project.users.map((userId) => users.users.find((user) => user.id === userId))]
                    })) ?? [],
                  users: [...users.users],
                  page,
                  size,
                  isLoading: PROJECTS_LOADING.NONE,
                  projectsLength: projects?.total ?? 0
                });
              })
            )
          )
        )
      ),
      getAllUsers: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: PROJECTS_LOADING.GET_USERS })),
          switchMap(() =>
            usersService.users$().pipe(
              tap((d) => patchState(store, { users: d.users, isLoading: PROJECTS_LOADING.NONE })),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      createProject: rxMethod<IEditProjectReq>(
        pipe(
          tap(() => patchState(store, { isLoading: PROJECTS_LOADING.CREATE })),
          switchMap((payload) =>
            projectsService.addProject$(payload).pipe(
              tap(() => patchState(store, { isLoading: PROJECTS_LOADING.REFRESH_TABLE })),
              tap(() => dialog.closeAll()),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      editProject: rxMethod<{ projectId: number; payload: IEditProjectReq }>(
        pipe(
          tap(() => patchState(store, { isLoading: PROJECTS_LOADING.EDIT })),
          switchMap(({ projectId, payload }) =>
            projectsService.editProject$(projectId, payload).pipe(
              tap(() => patchState(store, { isLoading: PROJECTS_LOADING.REFRESH_TABLE })),
              tap(() => dialog.closeAll()),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      deleteProject: rxMethod<{ projectId: number; projectName: string }>(
        pipe(
          tap(() => patchState(store, { isLoading: PROJECTS_LOADING.DELETE })),
          switchMap(({ projectId, projectName }) =>
            projectsService.deleteProject$(projectId, projectName).pipe(
              tap(() => {
                patchState(store, { isLoading: PROJECTS_LOADING.REFRESH_TABLE });
              }),
              tap(() => dialog.closeAll()),
              catchError(() => EMPTY)
            )
          )
        )
      )
    })
  ),
  withHooks((store, routerStoreService = inject(RouterStoreService)) => {
    return {
      onInit() {
        routerStoreService.getUrl$
          .pipe(
            take(1),
            tap((url) => {
              url.includes('switch-project')
                ? patchState(store, { isSwitchProject: true })
                : patchState(store, { isSwitchProject: false });
            })
          )
          .subscribe();
        store.queryProjectsTableByPage({});
      }
    };
  })
);
