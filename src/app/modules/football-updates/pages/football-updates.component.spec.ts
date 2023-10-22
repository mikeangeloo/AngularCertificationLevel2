import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootballUpdatesComponent } from './football-updates.component';

describe('FootballUpdatesComponent', () => {
  let component: FootballUpdatesComponent;
  let fixture: ComponentFixture<FootballUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FootballUpdatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FootballUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
