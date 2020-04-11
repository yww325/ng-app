import { Action, createReducer, on } from '@ngrx/store';
import * as PhotoActions from '../actions/photo.actions';

export const photoFeatureKey = 'photo';

export interface State {
  PhotosInfo : []
}

export const initialState: State = {
  PhotosInfo : []
};

const photoReducer = createReducer(
  initialState,

  on(PhotoActions.loadPhotos, state => state),
  on(PhotoActions.loadPhotosSuccess, (state, action) => {
    return {
      ...state,
      PhotosInfo: action.data.value
    } 
  }),
  on(PhotoActions.loadPhotosFailure, (state, action) => state),

);

export function reducer(state: State | undefined, action: Action) {
  return photoReducer(state, action);
}
