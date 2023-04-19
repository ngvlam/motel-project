import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateNewComponent } from './user-create-new.component';

describe('UserCreateNewComponent', () => {
  let component: UserCreateNewComponent;
  let fixture: ComponentFixture<UserCreateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCreateNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCreateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
