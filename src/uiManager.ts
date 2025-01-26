import { GAME_CONSTANTS } from './constants';

export class UIManager {
  private timerElement: HTMLElement | null;
  private scoreElement: HTMLElement | null;
  private gameOverElement: HTMLElement | null;
  private finalScoreElement: HTMLElement | null;

  constructor() {
    this.timerElement = document.getElementById('timer');
    this.scoreElement = document.getElementById('score');
    this.gameOverElement = document.getElementById('gameOver');
    this.finalScoreElement = document.getElementById('finalScore');
  }

  public updateTimer(timeRemaining: number): void {
    if (this.timerElement) {
      this.timerElement.textContent = `${timeRemaining}초`;
      this.updateTimerColor(timeRemaining);
    }
  }

  public updateScore(score: number): void {
    if (this.scoreElement) {
      this.scoreElement.textContent = `점수: ${score}`;
    }
  }

  public showGameOver(score: number): void {
    if (this.gameOverElement && this.finalScoreElement) {
      this.finalScoreElement.textContent = score.toString();
      this.gameOverElement.style.display = 'block';
    }
  }

  public hideGameOver(): void {
    if (this.gameOverElement) {
      this.gameOverElement.style.display = 'none';
    }
  }

  public resetTimer(): void {
    if (this.timerElement) {
      this.timerElement.textContent = `${GAME_CONSTANTS.TIME.INITIAL}초`;
      this.timerElement.style.color = '#000000';
    }
  }

  private updateTimerColor(timeRemaining: number): void {
    if (!this.timerElement) return;

    if (timeRemaining > GAME_CONSTANTS.TIME.WARNING_THRESHOLD) {
      this.timerElement.style.color = GAME_CONSTANTS.COLORS.SUCCESS;
    } else if (timeRemaining > GAME_CONSTANTS.TIME.DANGER_THRESHOLD) {
      this.timerElement.style.color = GAME_CONSTANTS.COLORS.WARNING;
    } else {
      this.timerElement.style.color = GAME_CONSTANTS.COLORS.DANGER;
    }
  }

  public resetScore(): void {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
      scoreElement.textContent = '점수: 0';
    }
  }
}
