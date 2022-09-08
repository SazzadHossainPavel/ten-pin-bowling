import { Component } from '@angular/core';

interface Frame {
  rolls: [string, string];
  cumulativeSum: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  noOfFrames = 10;
  availablePins: number[] = [];
  knockedPins: Frame[] = [];
  currentRoll: number = -1;
  currentFrame: number = -1;

  constructor() {
    for (let i = 0; i < this.noOfFrames; i++) {
      this.availablePins.push(i);
      this.knockedPins.push({ rolls: ['', ''], cumulativeSum: '' });
    }

    this.availablePins.push(this.noOfFrames);
  }

  randomRoll(rollZeroValue?: number) {
    return rollZeroValue
      ? Math.ceil(Math.random() * (11 - rollZeroValue)) - 1
      : Math.ceil(Math.random() * 11) - 1;
  }

  getRollIndex(n: number): number {
    return n % 2 == 0 ? 0 : 1;
  }

  generateKnockPins() {
    this.currentRoll++;

    const rollIndex = this.getRollIndex(this.currentRoll);

    let currentScore = 0;

    this.currentFrame = Math.floor(this.currentRoll / 2);

    if (this.currentFrame < this.noOfFrames) {
      if (this.knockedPins[this.currentFrame].rolls[0] === '') {
        currentScore = this.randomRoll();
      } else {
        currentScore = this.randomRoll(
          +this.knockedPins[this.currentFrame].rolls[0]
        );
      }

      if (rollIndex === 0 && currentScore === 10) {
        this.currentRoll++;

        if (this.currentFrame + 1 === this.noOfFrames) {
          this.knockedPins[this.noOfFrames - 1].rolls.push('');
        }
      }

      this.knockedPins[this.currentFrame].rolls[rollIndex] =
        currentScore.toString();

      const secondLastFrame =
        this.currentFrame > 1 ? this.currentFrame - 2 : -1;

      const previousFrame = this.currentFrame > 0 ? this.currentFrame - 1 : -1;

      if (secondLastFrame !== -1) {
        if (+this.knockedPins[secondLastFrame].rolls[0] === 10) {
          if (+this.knockedPins[previousFrame].rolls[0] === 10) {
            console.log('2 strikes');
            this.knockedPins[secondLastFrame].cumulativeSum = (
              +this.knockedPins[secondLastFrame].cumulativeSum +
              +this.knockedPins[this.currentFrame].rolls[0]
            ).toString();
          }
        }
      }

      if (previousFrame !== -1) {
        if (+this.knockedPins[previousFrame].rolls[0] === 10) {
          if (+this.knockedPins[this.currentFrame].rolls[0] !== 10) {
            if (rollIndex === 1) {
              this.knockedPins[previousFrame].cumulativeSum = (
                +this.knockedPins[previousFrame].cumulativeSum +
                +this.knockedPins[this.currentFrame].rolls[1]
              ).toString();
            }
          }
        }
      }

      if (previousFrame !== -1) {
        const previousSpare =
          rollIndex === 0 &&
          +this.knockedPins[previousFrame].rolls[0] +
            +this.knockedPins[previousFrame].rolls[1] ===
            10;

        if (previousSpare) {
          this.knockedPins[previousFrame].cumulativeSum = (
            +this.knockedPins[previousFrame].cumulativeSum +
            +this.knockedPins[this.currentFrame].rolls[0]
          ).toString();
        }
      }

      const cumulativeSumUpTo =
        this.currentFrame > 0
          ? this.knockedPins[this.currentFrame - 1].cumulativeSum
          : '';

      this.knockedPins[this.currentFrame].cumulativeSum = (
        +cumulativeSumUpTo +
        +this.knockedPins[this.currentFrame].rolls[0] +
        +this.knockedPins[this.currentFrame].rolls[1]
      ).toString();
    }
  }

  clearScore() {
    this.availablePins = [];
    this.knockedPins = [];
    this.currentRoll = -1;
    this.currentFrame = -1;

    for (let i = 0; i < this.noOfFrames; i++) {
      this.availablePins.push(i);
      this.knockedPins.push({ rolls: ['', ''], cumulativeSum: '' });
    }

    this.availablePins.push(this.noOfFrames);
  }

  addPins(num: number) {
    console.log(num);
  }
}
