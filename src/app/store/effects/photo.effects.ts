import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import * as PhotoActions from '../actions/photo.actions';
import { PhotoService } from '../../services/photo.service';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class PhotoEffects {
/* https://github.com/ngrx/platform/issues/1368 no more @effect decorator */
  loadPhotos$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(PhotoActions.loadPhotos),
      concatMap((act) =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        this.data.getPhotos(act.key, act.mediaType, act.pageSize, act.skipPage*act.pageSize, act.paths).pipe(
          map(data => PhotoActions.loadPhotosSuccess({ data })),
          catchError(error => of(PhotoActions.loadPhotosFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions, private data: PhotoService) {}

}
