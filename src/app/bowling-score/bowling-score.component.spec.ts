import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BowlingScoreComponent } from './bowling-score.component';

describe('BowlingScoreComponent', () => {
  let component: BowlingScoreComponent;
  let fixture: ComponentFixture<BowlingScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BowlingScoreComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BowlingScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'bowling-practice'`, () => {
    const h1 = fixture.debugElement.query(By.css('header h1'));

    expect(h1.nativeElement.innerText).toContain('Ten-pin Bowling');
  });
});
