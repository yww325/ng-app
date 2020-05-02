import { createAction, props } from '@ngrx/store';

export const loadPhotos = createAction(
  '[Photo] Load Photos',
  props<{
    key: string;
    mediaType : string;
    pageSize: number;
    skipPage : number;
    paths : string[];
  }>()
);

export const loadPhotosSuccess = createAction(
  '[Photo] Load Photos Success',
  props<{ data: any }>()
);

export const loadPhotosFailure = createAction(
  '[Photo] Load Photos Failure',
  props<{ error: any }>()
);
