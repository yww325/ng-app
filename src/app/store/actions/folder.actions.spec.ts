import * as fromFolder from './folder.actions';

describe('loadFolders', () => {
  it('should return an action', () => {
    expect(fromFolder.loadFolders().type).toBe('[Folder] Load Folders');
  });
});
