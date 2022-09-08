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
  allPins: { isAvailable: boolean; value: number }[] = [];
  knockedPins: Frame[] = [];
  noOfRolls: number = -1;
  currentFrame: number = -1;
  frameIndex: number = -1;

  constructor() {
    for (let i = 0; i < this.noOfFrames; i++) {
      this.allPins.push({ isAvailable: true, value: i });
      this.knockedPins.push({ rolls: ['', ''], cumulativeSum: '' });
    }

    this.allPins.push({ isAvailable: true, value: this.noOfFrames });
  }

  randomRoll(firstRoll?: number) {
    return firstRoll
      ? Math.ceil(Math.random() * (11 - firstRoll)) - 1
      : Math.ceil(Math.random() * 11) - 1;
  }

  getRollIndex(n: number): number {
    return n % 2 == 0 ? 0 : 1;
  }

  getRandomRollScore() {
    let currentScore = 0;

    if (this.knockedPins[this.currentFrame].rolls[0] === '') {
      currentScore = this.randomRoll();
    } else {
      currentScore = this.randomRoll(
        +this.knockedPins[this.currentFrame].rolls[0]
      );
    }

    return currentScore;
  }

  calculateScore(currentScore: number) {
    if (this.frameIndex === 0 && currentScore === 10) {
      this.noOfRolls++;

      if (this.currentFrame + 1 === this.noOfFrames) {
        this.knockedPins[this.noOfFrames - 1].rolls.push('');
      }
    }

    this.knockedPins[this.currentFrame].rolls[this.frameIndex] =
      currentScore.toString();

    const secondLastFrame = this.currentFrame > 1 ? this.currentFrame - 2 : -1;

    const previousFrame = this.currentFrame > 0 ? this.currentFrame - 1 : -1;

    if (secondLastFrame !== -1) {
      if (+this.knockedPins[secondLastFrame].rolls[0] === 10) {
        if (+this.knockedPins[previousFrame].rolls[0] === 10) {
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
          if (this.frameIndex === 1) {
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
        this.frameIndex === 0 &&
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

  startGame(n?: number) {
    this.noOfRolls++;

    this.frameIndex = this.getRollIndex(this.noOfRolls);

    this.currentFrame = Math.floor(this.noOfRolls / 2);

    if (this.currentFrame < this.noOfFrames) {
      const currentScore = n ? n : this.getRandomRollScore();

      this.calculateScore(currentScore);
    }
  }

  clearScore() {
    this.allPins = [];
    this.knockedPins = [];
    this.noOfRolls = -1;
    this.currentFrame = -1;

    for (let i = 0; i < this.noOfFrames; i++) {
      this.allPins.push({ isAvailable: true, value: i });
      this.knockedPins.push({ rolls: ['', ''], cumulativeSum: '' });
    }

    this.allPins.push({ isAvailable: true, value: this.noOfFrames });
  }

  addPins(n: number) {
    this.startGame(n);

    if (this.frameIndex === 1) {
      this.allPins.map((pins) => {
        pins.isAvailable = true;
        return pins;
      });
    } else {
      const availablePins = n === 10 ? 10 : 10 - n;

      for (let i = 0; i <= availablePins; i++) {
        this.allPins[i].isAvailable = true;
      }

      for (let i = availablePins + 1; i <= 10; i++) {
        this.allPins[i].isAvailable = false;
      }
    }
  }
}
