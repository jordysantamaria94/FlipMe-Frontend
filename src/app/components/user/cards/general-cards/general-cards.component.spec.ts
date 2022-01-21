import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCardsComponent } from './general-cards.component';

describe('GeneralCardsComponent', () => {
  let component: GeneralCardsComponent;
  let fixture: ComponentFixture<GeneralCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
