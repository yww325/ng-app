import * as fromPhoto from './photo.actions';

describe('loadPhotos', () => {
  it('should return an action', () => {
    expect(fromPhoto.loadPhotos().type).toBe('[Photo] Load Photos');
  });
});
