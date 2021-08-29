import { Action, createReducer, on } from "@ngrx/store";
import * as UserActions from "../actions/user.actions";

export const userFeatureKey = "userFeature";

export interface UserState {
  UsersInfo: [];
  loginState: string;
}

export const initialState: UserState = {
  UsersInfo: [],
  loginState: "unknown",
};

const userReducer = createReducer(
  initialState,

  on(UserActions.loadUsers, (state) => state), // just pass state, 1st is intial state.
  on(UserActions.loadUsersSuccess, (state, action) => {
    return {
      ...state,
      UsersInfo: action.data,
    }; // we should keep using the immutable state(setting state.UsersInfo with throw error), and updating it with spread.
    // see Updating Deep Immutable Object example at https://github.com/tc39/proposal-object-rest-spread/blob/master/Spread.md
  }),
  on(UserActions.loadUsersFailure, (state, action) => state),
  on(UserActions.loginStateChange, (state, action) => {
    return {
      ...state,
      loginState: action.newState,
    };
  })
);

export function reducer(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}
