import * as fromUser from '../reducers/user.reducer';
import { selectUserState } from './user.selectors';

describe('User feature state Selectors', () => {
  it('should select the feature state', () => {
    const result = selectUserState({
      [fromUser.userFeatureKey]: {UsersInfo : []}
    });

    expect(result).toEqual({UsersInfo : []});
  });
});
