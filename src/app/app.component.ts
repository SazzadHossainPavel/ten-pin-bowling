import { Component } from '@angular/core';

interface Frame {
  rolls: [number, number];
  cumulativeSum: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  noOfFrames = 10;
  knockedPins: Frame[] = [];
  currentRoll: number = -1;
  currentFrame: number = -1;

  constructor() {
    for (let i = 0; i < this.noOfFrames; i++) {
      this.knockedPins.push({ rolls: [0, 0], cumulativeSum: 0 });
    }

    this.knockedPins[this.noOfFrames - 1].rolls.push(0);
  }

  random() {
    return Math.ceil(Math.random() * 11) - 1;
  }

  randomRoll(rollZeroValue: number | undefined) {
    return rollZeroValue
      ? Math.ceil(Math.random() * 11 - rollZeroValue) - 1
      : Math.ceil(Math.random() * 11) - 1;
  }

  isOddOrEven(n: number): number {
    return n % 2 == 0 ? 0 : 1;
  }

  generateKnockPins() {
    this.currentRoll++;

    const rollIndex = this.isOddOrEven(this.currentRoll);

    const currentScore = this.random();

    if (rollIndex === 0 && currentScore === 10) {
      this.currentRoll++;
    }

    this.currentFrame = Math.floor(this.currentRoll / 2);

    if (this.currentFrame < this.noOfFrames) {
      this.knockedPins[this.currentFrame].rolls[rollIndex] = currentScore;

      const cumulativeSumUpTo =
        this.currentFrame > 0
          ? this.knockedPins[this.currentFrame - 1].cumulativeSum
          : 0;

      this.knockedPins[this.currentFrame].cumulativeSum =
        cumulativeSumUpTo +
        this.knockedPins[this.currentFrame].rolls[0] +
        this.knockedPins[this.currentFrame].rolls[1];
    }

    console.log(this.knockedPins);
  }

  clearScore() {
    this.knockedPins = [];
    this.currentRoll = -1;
    this.currentFrame = -1;

    for (let i = 0; i <= 9; i++) {
      this.knockedPins.push({ rolls: [0, 0], cumulativeSum: 0 });
    }

    this.knockedPins[this.noOfFrames - 1].rolls.push(0);
  }
}
