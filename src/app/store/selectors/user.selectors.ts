import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from '../reducers/user.reducer';
 

export const selectUserState = createFeatureSelector<fromUser.State>(
  fromUser.userFeatureKey
);

export const selectUsersInfo = createSelector(selectUserState, state=>
  {
    return state.UsersInfo; // project the property with data info.
  }); 
 
  