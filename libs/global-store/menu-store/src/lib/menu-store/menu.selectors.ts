import { MenuItem } from '@neo-edge-web/models';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectMenuState = createFeatureSelector<MenuItem[]>('menuTree');
export const selectMenuTree = createSelector(selectMenuState, (menu) => menu);
