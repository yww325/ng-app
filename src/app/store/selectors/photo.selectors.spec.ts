import * as fromPhoto from '../reducers/photo.reducer';
import { selectPhotoState } from './photo.selectors';

describe('Photo Selectors', () => {
  it('should select the feature state', () => {
    const result = selectPhotoState({
      [fromPhoto.photoFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
