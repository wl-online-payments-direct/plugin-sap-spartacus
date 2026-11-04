import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineTokenizationThreedsComponent } from './worldline-tokenization-threeds.component';

describe('WorldlineTokenizationThreedsComponent', () => {
  let component: WorldlineTokenizationThreedsComponent;
  let fixture: ComponentFixture<WorldlineTokenizationThreedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineTokenizationThreedsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlineTokenizationThreedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
