import * as fromFolder from '../reducers/folder.reducer';
import { selectFolderState } from './folder.selectors';

describe('Folder Selectors', () => {
  it('should select the feature state', () => {
    const result = selectFolderState({
      [fromFolder.folderFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
