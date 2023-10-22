import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturesFaceToFaceComponent } from './fixtures-face-to-face.component';

describe('FixturesFaceToFaceComponent', () => {
  let component: FixturesFaceToFaceComponent;
  let fixture: ComponentFixture<FixturesFaceToFaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixturesFaceToFaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturesFaceToFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
