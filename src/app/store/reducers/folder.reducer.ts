import { Action, createReducer, on } from '@ngrx/store';
import * as FolderActions from '../actions/folder.actions';

export const folderFeatureKey = 'folder';

export interface State {
  Folders:[]
}

export const initialState: State = {
  Folders:[]
};

const folderReducer = createReducer(
  initialState,

  on(FolderActions.loadFolders, state => state),
  on(FolderActions.loadFoldersSuccess, (state, action) => {
    return {
      ...state,
      Folders: action.data.value
    } 
  }),
  on(FolderActions.loadFoldersFailure, (state, action) => state),

);

export function reducer(state: State | undefined, action: Action) {
  return folderReducer(state, action);
}
