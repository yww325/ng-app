import { reducer, initialState } from './user.reducer';
import * as UserActions from '../actions/user.actions';

describe('User Reducer', () => {
  describe('loadUsers action', () => {
    it('should return the previous state', () => { 
      const result = reducer(initialState, UserActions.loadUsers);

      expect(result).toBe(initialState);
    });
  });
});
