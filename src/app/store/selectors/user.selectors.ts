import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from '../reducers/user.reducer';
 

export const selectUserState = createFeatureSelector<fromUser.State>(
  fromUser.userFeatureKey
);

export const selectUsersInfo = createSelector<fromUser.State, fromUser.State, any[]>(wholeStoreState=>
  {
    return wholeStoreState[fromUser.userFeatureKey]; // can be a const, to always select feature state by feature key(like a sub store).
  }, state=>
  {
    return state.UsersInfo; // project the property with data info.
  }); 
 
  