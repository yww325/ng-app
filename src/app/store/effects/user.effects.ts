import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as UserActions from '../actions/user.actions';
import { DataService } from '../../services/data.service'


@Injectable()
export class UserEffects {

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(UserActions.loadUsers),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        //EMPTY.pipe(
        this.data.getJSON().pipe( 
        map(users => 
          {
           return UserActions.loadUsersSuccess( {data : users} ); //create action's payload, 
           // which is used by ActionCreator's callback's "props" parameter, accepting type {data:any} except array or with a type property.
           // after creation, then give it to loadUsersSuccess's ActionCreator callback
          }),
          catchError(error => of(UserActions.loadUsersFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions, private data: DataService) {}

}
