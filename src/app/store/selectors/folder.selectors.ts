import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFolder from '../reducers/folder.reducer';

export const selectFolderState = createFeatureSelector<fromFolder.State>(
  fromFolder.folderFeatureKey
);

export const selectFolders= createSelector(selectFolderState, state=>
  {
    return state.Folders // project the property with data info.
  }); 
