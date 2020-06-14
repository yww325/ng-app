import { Action, createReducer, on } from '@ngrx/store';
import * as PhotoActions from '../actions/photo.actions';
import { Photo } from '../../models/photo';

export const photoFeatureKey = 'photo';

export interface State {
  PhotosInfo : Photo[],
  count : 0
}

export const initialState: State = {
  PhotosInfo : [],
  count : 0
};

const photoReducer = createReducer(
  initialState,

  on(PhotoActions.loadPhotos, state => state),
  on(PhotoActions.loadPhotosSuccess, (state, action) => {
    return {
      ...state,
      PhotosInfo: action.data.value,
      count : action.data['@odata.count'],
    } 
  }),
  on(PhotoActions.loadPhotosFailure, (state, action) => state),

);

export function reducer(state: State | undefined, action: Action) {
  return photoReducer(state, action);
}
