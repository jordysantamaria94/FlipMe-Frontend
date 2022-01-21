import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsDeckComponent } from './stats-deck.component';

describe('StatsDeckComponent', () => {
  let component: StatsDeckComponent;
  let fixture: ComponentFixture<StatsDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsDeckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
