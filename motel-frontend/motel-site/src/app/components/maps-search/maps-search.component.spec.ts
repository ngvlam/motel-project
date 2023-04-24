import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsSearchComponent } from './maps-search.component';

describe('MapsSearchComponent', () => {
  let component: MapsSearchComponent;
  let fixture: ComponentFixture<MapsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
