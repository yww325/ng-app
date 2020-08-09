import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewFolderDialogComponent } from './create-new-folder-dialog.component';

describe('CreateNewFolderDialogComponent', () => {
  let component: CreateNewFolderDialogComponent;
  let fixture: ComponentFixture<CreateNewFolderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewFolderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewFolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
