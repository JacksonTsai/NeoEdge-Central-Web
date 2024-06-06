import { MenuItem } from '@neo-edge-web/models';
import { createAction, props } from '@ngrx/store';

export const updateMenu = createAction('[Menu] Init Menu', props<{ menuTree: MenuItem[] }>());
