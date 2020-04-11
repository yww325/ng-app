import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPhoto from '../reducers/photo.reducer';

export const selectPhotoState = createFeatureSelector<fromPhoto.State>(
  fromPhoto.photoFeatureKey
);

export const selectPhotosInfo = createSelector(selectPhotoState, state=>
  {
    return state.PhotosInfo; // project the property with data info.
  }); 
 
