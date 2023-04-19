import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolateComponent } from './violate.component';

describe('ViolateComponent', () => {
  let component: ViolateComponent;
  let fixture: ComponentFixture<ViolateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViolateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
