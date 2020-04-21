import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as FolderActions from '../actions/folder.actions';
import { FolderService } from 'src/app/services/folder.service';



@Injectable()
export class FolderEffects {

  loadFolders$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(FolderActions.loadFolders),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        this.data.getFolders().pipe(
          map(data => FolderActions.loadFoldersSuccess({ data })),
          catchError(error => of(FolderActions.loadFoldersFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions, private data: FolderService) {}

}
