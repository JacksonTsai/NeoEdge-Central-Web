import { MenuItem } from '@neo-edge-web/models';
import { createReducer, on } from '@ngrx/store';
import * as MenuAction from './menu.actions';

const initialState: MenuItem[] = [
  {
    displayName: '',
    icon: '',
    path: '',
    isExpanded: false,
    isActive: false,
    permission: [],
    children: []
  }
];

export const menuReducer = createReducer(
  initialState,
  on(MenuAction.updateMenu, (state, { menuTree }) => [...menuTree])
);
