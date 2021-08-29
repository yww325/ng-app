import { createAction, props } from "@ngrx/store";

export const loadUsers = createAction("[User] Load Users");

export const loadUsersSuccess = createAction(
  "[User] Load Users Success",
  props<{ data: any }>()
);

export const loadUsersFailure = createAction(
  "[User] Load Users Failure",
  props<{ error: any }>()
);

export const loginUser = createAction(
  "[User] Login the only one user",
  props<{ password: string }>()
);

export const logoutUser = createAction("[User] Logout the only one user");

export const loginStateChange = createAction(
  "[User] Changing the current login state",
  props<{ newState: string }>()
);
