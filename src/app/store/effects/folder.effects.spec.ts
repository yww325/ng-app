import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { FolderEffects } from './folder.effects';

describe('FolderEffects', () => {
  let actions$: Observable<any>;
  let effects: FolderEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FolderEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<FolderEffects>(FolderEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
