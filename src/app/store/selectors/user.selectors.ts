import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromUser from "../reducers/user.reducer";

export const selectUserState = createFeatureSelector<fromUser.UserState>(
  fromUser.userFeatureKey
);

export const selectUsersInfo = createSelector(selectUserState, (state) => {
  return state.UsersInfo; // project the property with data info.
});

export const selectLoginState = createSelector(selectUserState, (state) => {
  return state.loginState; // project the property with login state.
});
