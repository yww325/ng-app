import { createAction, props } from '@ngrx/store';

export const loadFolders = createAction(
  '[Folder] Load Folders'
);

export const loadFoldersSuccess = createAction(
  '[Folder] Load Folders Success',
  props<{ data: any }>()
);

export const loadFoldersFailure = createAction(
  '[Folder] Load Folders Failure',
  props<{ error: any }>()
);
