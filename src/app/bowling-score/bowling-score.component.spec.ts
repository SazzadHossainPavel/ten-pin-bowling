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

  it('should show roll value 5 in first roll', () => {
    const allPinBtns = fixture.debugElement.queryAll(
      By.css('button.btn.btn-roll')
    );
    const fifthPinBtn = allPinBtns.find((item) =>
      item.nativeElement.innerText.includes('5')
    );

    fifthPinBtn?.triggerEventHandler('click', { target: { value: 5 } });

    fixture.detectChanges();

    const pointSpan = fixture.debugElement.query(By.css('span.point'));

    expect(pointSpan.nativeElement.innerText).toEqual('5');
  });

  it('should show cumulative value 5 in first roll', () => {
    const allPinBtns = fixture.debugElement.queryAll(
      By.css('button.btn.btn-roll')
    );
    const fifthPinBtn = allPinBtns.find((item) =>
      item.nativeElement.innerText.includes('5')
    );

    fifthPinBtn?.triggerEventHandler('click', { target: { value: 5 } });

    fixture.detectChanges();

    const cumulativeSpan = fixture.debugElement.query(By.css('span.frame'));

    expect(cumulativeSpan.nativeElement.innerText).toEqual('5');
  });

  it('should show total score value 5 in first roll', () => {
    const allPinBtns = fixture.debugElement.queryAll(
      By.css('button.btn.btn-roll')
    );
    const fifthPinBtn = allPinBtns.find((item) =>
      item.nativeElement.innerText.includes('5')
    );

    fifthPinBtn?.triggerEventHandler('click', { target: { value: 5 } });

    fixture.detectChanges();

    const totalSumContainer = fixture.debugElement.query(
      By.css('.total-sum-value')
    );

    expect(totalSumContainer.nativeElement.innerText).toEqual('5');
  });

  it('should show a spare(/) on first frame when added 5 after 5', () => {
    const allPinBtns = fixture.debugElement.queryAll(
      By.css('button.btn.btn-roll')
    );
    const fifthPinBtn = allPinBtns.find((item) =>
      item.nativeElement.innerText.includes('5')
    );

    fifthPinBtn?.triggerEventHandler('click', { target: { value: 5 } });
    fixture.detectChanges();

    fifthPinBtn?.triggerEventHandler('click', { target: { value: 5 } });
    fixture.detectChanges();

    const allPointSpans = fixture.debugElement.queryAll(By.css('span.point'));

    const secondRollSpan = allPointSpans[1];

    expect(secondRollSpan.nativeElement.innerText).toEqual('/');
  });

  it('should update cumulative value to 10 on first frame when added 5 after 5', () => {
    const allPinBtns = fixture.debugElement.queryAll(
      By.css('button.btn.btn-roll')
    );
    const fifthPinBtn = allPinBtns.find((item) =>
      item.nativeElement.innerText.includes('5')
    );

    fifthPinBtn?.triggerEventHandler('click', { target: { value: 5 } });
    fixture.detectChanges();

    fifthPinBtn?.triggerEventHandler('click', { target: { value: 5 } });
    fixture.detectChanges();

    const cumulativeSpans = fixture.debugElement.queryAll(By.css('span.frame'));

    const secondRollSpan = cumulativeSpans[0];

    expect(secondRollSpan.nativeElement.innerText).toEqual('10');
  });

  it('should update cumulative value to 17 on first frame when added 7 after 5, 5', () => {
    const allPinBtns = fixture.debugElement.queryAll(
      By.css('button.btn.btn-roll')
    );
    const fifthPinBtn = allPinBtns.find((item) =>
      item.nativeElement.innerText.includes('5')
    );

    fifthPinBtn?.triggerEventHandler('click', { target: { value: 5 } });
    fixture.detectChanges();

    fifthPinBtn?.triggerEventHandler('click', { target: { value: 5 } });
    fixture.detectChanges();

    const seventhPinBtn = allPinBtns.find((item) =>
      item.nativeElement.innerText.includes('7')
    );

    seventhPinBtn?.triggerEventHandler('click', { target: { value: 7 } });
    fixture.detectChanges();

    const cumulativeSpans = fixture.debugElement.queryAll(By.css('span.frame'));

    const firstRollSpan = cumulativeSpans[0];

    expect(firstRollSpan.nativeElement.innerText).toEqual('17');
  });

  it('should show a strike(X) when added 10 in first roll', () => {
    const allPinBtns = fixture.debugElement.queryAll(
      By.css('button.btn.btn-roll')
    );
    const tenthPinBtn = allPinBtns.find((item) =>
      item.nativeElement.innerText.includes('10')
    );

    tenthPinBtn?.triggerEventHandler('click', { target: { value: 10 } });
    fixture.detectChanges();

    const allPointSpans = fixture.debugElement.queryAll(By.css('span.point'));

    const firstPointSpan = allPointSpans[0];

    expect(firstPointSpan.nativeElement.innerText).toEqual('✕');
  });

  it("should update the first frame's cumulative sum to 27 when added 7 after 10, 10", () => {
    const allPinBtns = fixture.debugElement.queryAll(
      By.css('button.btn.btn-roll')
    );
    const tenthPinBtn = allPinBtns.find((item) =>
      item.nativeElement.innerText.includes('10')
    );

    tenthPinBtn?.triggerEventHandler('click', { target: { value: 10 } });
    fixture.detectChanges();

    tenthPinBtn?.triggerEventHandler('click', { target: { value: 10 } });
    fixture.detectChanges();

    const seventhPinBtn = allPinBtns.find((item) =>
      item.nativeElement.innerText.includes('7')
    );

    seventhPinBtn?.triggerEventHandler('click', { target: { value: 7 } });
    fixture.detectChanges();

    const allCumulativeSpans = fixture.debugElement.queryAll(
      By.css('span.frame')
    );

    const firstCumulativeSpan = allCumulativeSpans[0];

    expect(firstCumulativeSpan.nativeElement.innerText).toEqual('27');
  });

  it('should show 3 consecutive strike(X) on 3 consecutive first roll', () => {
    const allPinBtns = fixture.debugElement.queryAll(
      By.css('button.btn.btn-roll')
    );
    const tenthPinBtn = allPinBtns.find((item) =>
      item.nativeElement.innerText.includes('10')
    );

    tenthPinBtn?.triggerEventHandler('click', { target: { value: 10 } });
    fixture.detectChanges();

    tenthPinBtn?.triggerEventHandler('click', { target: { value: 10 } });
    fixture.detectChanges();

    tenthPinBtn?.triggerEventHandler('click', { target: { value: 10 } });
    fixture.detectChanges();

    const allPointSpans = fixture.debugElement.queryAll(By.css('span.point'));

    allPointSpans.forEach((item, index) => {
      if (index === 0 || index === 2 || index === 4)
        expect(item.nativeElement.innerText).toEqual('✕');
    });
  });

  it(`should make disabled 'Random knocked pins' button when clicked any specific pins button`, () => {
    const allPinBtns = fixture.debugElement.queryAll(
      By.css('button.btn.btn-roll')
    );
    const anyBtn = allPinBtns[Math.ceil(Math.random() * 11) - 1];

    anyBtn?.triggerEventHandler('click', {});

    fixture.detectChanges();

    const randomBtn = fixture.debugElement.query(
      By.css('.action-container button')
    );

    expect(randomBtn.nativeElement.disabled).toBeTrue();
  });
});
