import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPhoto from '../reducers/photo.reducer';
import { Photo } from 'src/app/models/photo';

export const selectPhotoState = createFeatureSelector<fromPhoto.State>(
  fromPhoto.photoFeatureKey
);

export const selectPhotosInfo = createSelector(selectPhotoState, state=>
  {
    return {
      count:  state.count,
      PhotosInfo : state.PhotosInfo // project the property with data info.
    };
  }); 

//  function filterPhotoType(a : Photo[]) : Photo[]{
//     return a.filter(p=>p.mediaType =='photo');
//    } 
 
