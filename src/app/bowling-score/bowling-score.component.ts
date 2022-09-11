import { Component } from '@angular/core';
import { Frame } from './frame.model';

@Component({
  selector: 'app-bowling-score',
  templateUrl: './bowling-score.component.html',
  styleUrls: ['./bowling-score.component.scss'],
})
export class BowlingScoreComponent {
  noOfFrames = 10;
  allPins: { isAvailable: boolean; value: number }[] = [];
  knockedPins: Frame[] = [];
  noOfRolls: number = -1;
  currentFrame: number = -1;
  frameIndex: number = -1;
  isGameOver = false;
  isSpecificPins = true;
  isRandomPins = true;
  totalSum = 0;

  constructor() {
    this.initializeGame();
  }

  // adds random generated knocked pins from the available options and continue the game
  addRandomPins() {
    this.isSpecificPins = false;
    this.isRandomPins = true;

    const n = this.getRandomRollScore();
    this.startGame(n);
  }

  // adds specific knocked pins and continue the game
  addSpecificPins(n: number) {
    this.isSpecificPins = true;
    this.isRandomPins = false;

    this.startGame(n);
    this.checkAvailablePins(n);
  }

  // clears previous score and initializes the game
  clearScore() {
    this.allPins = [];
    this.knockedPins = [];
    this.noOfRolls = -1;
    this.currentFrame = -1;
    this.isGameOver = false;
    this.frameIndex = -1;
    this.isSpecificPins = true;
    this.isRandomPins = true;
    this.totalSum = 0;

    this.initializeGame();
  }

  // initializes available pins and knocked pins array
  private initializeGame() {
    for (let i = 0; i < this.noOfFrames; i++) {
      this.allPins.push({ isAvailable: true, value: i });
      this.knockedPins.push({ rolls: ['', ''], cumulativeSum: '' });
    }

    this.allPins.push({ isAvailable: true, value: this.noOfFrames });
  }

  // generates random roll from the available options
  private randomRoll(firstRoll?: number) {
    return firstRoll
      ? Math.ceil(Math.random() * (11 - firstRoll)) - 1
      : Math.ceil(Math.random() * 11) - 1;
  }

  // returns current roll index
  private getRollIndex(n: number): number {
    if (
      this.currentFrame !== -1 &&
      this.knockedPins[this.currentFrame].rolls.length > 2
    ) {
      return n % 3 == 0 ? 0 : n % 3 === 1 ? 1 : 2;
    } else {
      return n % 2 == 0 ? 0 : 1;
    }
  }

  // returns current roll score
  private getRandomRollScore() {
    let currentScore = 0;

    if (
      this.currentFrame === -1 ||
      this.knockedPins[this.currentFrame].rolls[0] === ''
    ) {
      // when first roll value is not initialized, generates random number from 0 to 10
      currentScore = this.randomRoll();
    } else {
      // when first roll value is initialized, generates random number from 0 to first roll
      currentScore = this.randomRoll(
        Number(this.knockedPins[this.currentFrame].rolls[0])
      );
    }

    return currentScore;
  }

  // tracks whether the game is over or not
  private checkGameOver() {
    if (this.currentFrame === 9) {
      if (
        // game is over when 10th frame first roll is a strike and completes all the 3 rolls
        Number(this.knockedPins[9].rolls[0]) === 10 &&
        this.knockedPins[9].rolls[1] !== '' &&
        this.knockedPins[9].rolls[2] !== ''
      ) {
        this.isGameOver = true;
        return;
      } else if (
        // or, game is over when 10th frame has a spare and completes all the 3 rolls
        Number(this.knockedPins[9].rolls[0]) !== 10 &&
        Number(this.knockedPins[9].rolls[0]) +
          Number(this.knockedPins[9].rolls[1]) ===
          10 &&
        this.knockedPins[9].rolls[2] !== ''
      ) {
        this.isGameOver = true;
        return;
      } else if (
        // otherwise, game is over when 10th frame completes all the 2 rolls
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

  // calculates cumulative score and total score
  private calculateScore() {
    const secondLastFrame = this.currentFrame > 1 ? this.currentFrame - 2 : -1;

    const previousFrame = this.currentFrame > 0 ? this.currentFrame - 1 : -1;

    // strike's bonus calculation for 2nd bonus
    if (secondLastFrame !== -1) {
      // executes when second last frame is valid
      if (Number(this.knockedPins[secondLastFrame].rolls[0]) === 10) {
        if (Number(this.knockedPins[previousFrame].rolls[0]) === 10) {
          if (this.frameIndex === 0) {
            // executes when second last frame and last frame has consecutive strikes
            // then adds the current roll value to the second last frame's cumulative value
            this.knockedPins[secondLastFrame].cumulativeSum = (
              Number(this.knockedPins[secondLastFrame].cumulativeSum) +
              Number(this.knockedPins[this.currentFrame].rolls[0])
            ).toString();

            // and updates the last frame's cumulative value
            this.knockedPins[previousFrame].cumulativeSum = (
              Number(this.knockedPins[previousFrame].cumulativeSum) +
              Number(this.knockedPins[this.currentFrame].rolls[0])
            ).toString();
          }
        }
      }
    }

    // strike's bonus calculation for 1st bonus
    if (previousFrame !== -1) {
      // executes when last frame is valid
      if (Number(this.knockedPins[previousFrame].rolls[0]) === 10) {
        if (this.frameIndex === 0) {
          // executes when last frame has a strike
          // then adds the first roll value to the last frame's cumulative value
          this.knockedPins[previousFrame].cumulativeSum = (
            Number(this.knockedPins[previousFrame].cumulativeSum) +
            Number(this.knockedPins[this.currentFrame].rolls[0])
          ).toString();
        }

        if (this.frameIndex === 1) {
          // executes when last frame has a strike
          // then adds the second roll value to the last frame's cumulative value
          this.knockedPins[previousFrame].cumulativeSum = (
            Number(this.knockedPins[previousFrame].cumulativeSum) +
            Number(this.knockedPins[this.currentFrame].rolls[1])
          ).toString();
        }
      }
    }

    // spare's bonus calculation
    if (previousFrame !== -1) {
      // executes when last frame is valid
      const previousSpare =
        this.frameIndex === 0 &&
        Number(this.knockedPins[previousFrame].rolls[0]) +
          Number(this.knockedPins[previousFrame].rolls[1]) ===
          10 &&
        Number(this.knockedPins[previousFrame].rolls[0]) !== 10;

      if (previousSpare) {
        // executes when a valid spare is found
        // then adds the first roll value to the last frame's cumulative value
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

    // normal cumulative score calculation
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

    // total score
    this.totalSum = Number(this.knockedPins[this.currentFrame].cumulativeSum);
  }

  // checks and adds when 10th frame has 3rd index
  private checkThirdRoll(currentScore: number) {
    if (this.frameIndex === 0 && currentScore === 10) {
      if (this.currentFrame === 9) {
        // adds 3rd index when 10th frame's first roll has a strike
        this.knockedPins[this.currentFrame].rolls.push('');
      } else {
        // when a strike found, it doesn't execute the second roll
        // so it goes to next frame
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
      // adds 3rd index when 10th frame's first roll has no strike and a spare found
      this.knockedPins[this.currentFrame].rolls.push('');
    }
  }

  // starts the game, updates the scores and checks whether the game over or not
  private startGame(currentScore: number) {
    // updates the number of rolls
    this.noOfRolls++;

    // calculates the frame index
    this.frameIndex = this.getRollIndex(this.noOfRolls);

    // calculates current frame from the number of rolls
    this.currentFrame =
      this.currentFrame !== -1 &&
      this.knockedPins[this.currentFrame].rolls.length > 2
        ? 9
        : Math.floor(this.noOfRolls / 2);

    this.knockedPins[this.currentFrame].rolls[this.frameIndex] =
      currentScore.toString();

    if (this.currentFrame < this.noOfFrames) {
      // executes upto 10th frame
      this.checkThirdRoll(currentScore);
      this.calculateScore();
      this.checkGameOver();
    }
  }

  // checks available pins for specific knocked pins
  private checkAvailablePins(n: number) {
    if (
      (this.frameIndex === 1 && this.currentFrame !== 9) ||
      (this.currentFrame === 9 &&
        Number(this.knockedPins[9].rolls[0]) +
          Number(this.knockedPins[9].rolls[1]) ===
          10)
    ) {
      // all pins available, 1) when second roll already executed and it's not 10th frame
      // 2) when 10th frame has a spare
      this.allPins.map((pins) => {
        pins.isAvailable = true;
        return pins;
      });
    } else {
      // otherwise, calculates unavailable pins
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
