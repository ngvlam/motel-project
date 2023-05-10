import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestNotComponent } from './test-not.component';

describe('TestNotComponent', () => {
  let component: TestNotComponent;
  let fixture: ComponentFixture<TestNotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestNotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestNotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
