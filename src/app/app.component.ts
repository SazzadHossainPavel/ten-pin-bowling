import { Component } from '@angular/core';

interface Frame {
  rolls: [string, string, string?];
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
  isGameOver = false;

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
    if (
      this.currentFrame !== -1 &&
      this.knockedPins[this.currentFrame].rolls.length > 2
    ) {
      return n % 3 == 0 ? 0 : n % 3 === 1 ? 1 : 2;
    } else {
      return n % 2 == 0 ? 0 : 1;
    }
  }

  getRandomRollScore() {
    let currentScore = 0;

    if (this.knockedPins[this.currentFrame].rolls[0] === '') {
      currentScore = this.randomRoll();
    } else {
      currentScore = this.randomRoll(
        Number(this.knockedPins[this.currentFrame].rolls[0])
      );
    }

    return currentScore;
  }

  checkGameOver() {
    if (this.currentFrame === 9) {
      if (
        Number(this.knockedPins[9].rolls[0]) === 10 &&
        this.knockedPins[9].rolls[1] !== '' &&
        this.knockedPins[9].rolls[2] !== ''
      ) {
        this.isGameOver = true;
        return;
      } else if (
        Number(this.knockedPins[9].rolls[0]) !== 10 &&
        Number(this.knockedPins[9].rolls[0]) +
          Number(this.knockedPins[9].rolls[1]) ===
          10 &&
        this.knockedPins[9].rolls[2] !== ''
      ) {
        this.isGameOver = true;
        return;
      } else if (
        Number(this.knockedPins[9].rolls[0]) !== 10 &&
        Number(this.knockedPins[9].rolls[0]) +
          Number(this.knockedPins[9].rolls[1]) !==
          10 &&
        this.knockedPins[9].rolls[1] !== ''
      ) {
        this.isGameOver = true;
        return;
      }
    }
  }

  calculateScore() {
    const secondLastFrame = this.currentFrame > 1 ? this.currentFrame - 2 : -1;

    const previousFrame = this.currentFrame > 0 ? this.currentFrame - 1 : -1;

    if (secondLastFrame !== -1) {
      if (Number(this.knockedPins[secondLastFrame].rolls[0]) === 10) {
        if (Number(this.knockedPins[previousFrame].rolls[0]) === 10) {
          if (this.frameIndex === 0) {
            this.knockedPins[secondLastFrame].cumulativeSum = (
              Number(this.knockedPins[secondLastFrame].cumulativeSum) +
              Number(this.knockedPins[this.currentFrame].rolls[0])
            ).toString();

            this.knockedPins[previousFrame].cumulativeSum = (
              Number(this.knockedPins[previousFrame].cumulativeSum) +
              Number(this.knockedPins[this.currentFrame].rolls[0])
            ).toString();
          }
        }
      }
    }

    if (previousFrame !== -1) {
      if (+this.knockedPins[previousFrame].rolls[0] === 10) {
        if (this.frameIndex === 0) {
          this.knockedPins[previousFrame].cumulativeSum = (
            Number(this.knockedPins[previousFrame].cumulativeSum) +
            Number(this.knockedPins[this.currentFrame].rolls[0])
          ).toString();
        }

        if (this.frameIndex === 1) {
          this.knockedPins[previousFrame].cumulativeSum = (
            Number(this.knockedPins[previousFrame].cumulativeSum) +
            Number(this.knockedPins[this.currentFrame].rolls[1])
          ).toString();
        }
      }
    }

    if (previousFrame !== -1) {
      const previousSpare =
        this.frameIndex === 0 &&
        Number(this.knockedPins[previousFrame].rolls[0]) +
          Number(this.knockedPins[previousFrame].rolls[1]) ===
          10 &&
        Number(this.knockedPins[previousFrame].rolls[0]) !== 10;

      if (previousSpare) {
        this.knockedPins[previousFrame].cumulativeSum = (
          Number(this.knockedPins[previousFrame].cumulativeSum) +
          Number(this.knockedPins[this.currentFrame].rolls[0])
        ).toString();
      }
    }

    const cumulativeSumUpTo =
      this.currentFrame > 0
        ? this.knockedPins[this.currentFrame - 1].cumulativeSum
        : '';

    this.knockedPins[this.currentFrame].cumulativeSum =
      this.knockedPins[this.currentFrame].rolls.length === 3
        ? (
            Number(cumulativeSumUpTo) +
            Number(this.knockedPins[this.currentFrame].rolls[0]) +
            Number(this.knockedPins[this.currentFrame].rolls[1]) +
            Number(this.knockedPins[this.currentFrame].rolls[2])
          ).toString()
        : (
            Number(cumulativeSumUpTo) +
            Number(this.knockedPins[this.currentFrame].rolls[0]) +
            Number(this.knockedPins[this.currentFrame].rolls[1])
          ).toString();
  }

  addThirdIndex(currentScore: number) {
    if (this.frameIndex === 0 && currentScore === 10) {
      if (this.currentFrame === 9) {
        this.knockedPins[this.currentFrame].rolls.push('');
      } else {
        this.noOfRolls++;
      }
    } else if (
      this.currentFrame === 9 &&
      Number(this.knockedPins[9].rolls[0]) !== 10 &&
      Number(this.knockedPins[9].rolls[0]) +
        Number(this.knockedPins[9].rolls[1]) ===
        10 &&
      this.knockedPins[9].rolls.length === 2
    ) {
      this.knockedPins[this.currentFrame].rolls.push('');
    }
  }

  startGame(n?: number) {
    this.noOfRolls++;

    this.frameIndex = this.getRollIndex(this.noOfRolls);

    this.currentFrame =
      this.currentFrame !== -1 &&
      this.knockedPins[this.currentFrame].rolls.length > 2
        ? 9
        : Math.floor(this.noOfRolls / 2);

    const currentScore =
      typeof n !== 'undefined' ? n : this.getRandomRollScore();

    this.knockedPins[this.currentFrame].rolls[this.frameIndex] =
      currentScore.toString();

    if (this.currentFrame < this.noOfFrames) {
      this.addThirdIndex(currentScore);
      this.calculateScore();
      this.checkGameOver();
    }
  }

  clearScore() {
    this.allPins = [];
    this.knockedPins = [];
    this.noOfRolls = -1;
    this.currentFrame = -1;
    this.isGameOver = false;
    this.frameIndex = -1;

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
