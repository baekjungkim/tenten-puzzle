import { GameState, GameConfig, Position } from './types';
import { GAME_CONSTANTS } from './constants';
import { GameRenderer } from './renderer';
import { GameLogic } from './gameLogic';
import { EventHandler } from './eventHandler';
import { UIManager } from './uiManager';
import { AudioManager } from './audioManager';
import { CookieManager } from './cookieManager';

export class TentenGamebox {
  private state: GameState;
  private renderer: GameRenderer;
  private logic: GameLogic;
  private eventHandler: EventHandler;
  private uiManager: UIManager;
  private timerInterval: NodeJS.Timeout | null = null;
  private audioManager: AudioManager;
  private isBGMOn: boolean = true;

  constructor(config: GameConfig) {
    const canvas = document.getElementById(config.canvasId) as HTMLCanvasElement;
    if (!canvas) throw new Error('Canvas element not found');

    // 초기 상태 설정
    this.state = {
      tiles: [],
      score: 0,
      timeRemaining: GAME_CONSTANTS.TIME.INITIAL,
      currentColor: GAME_CONSTANTS.COLORS.DEFAULT,
    };

    // 컴포넌트 초기화
    this.renderer = new GameRenderer(canvas, config.isMobile);
    const cellSize = config.isMobile
      ? GAME_CONSTANTS.CELL.MOBILE_SIZE
      : GAME_CONSTANTS.CELL.DEFAULT_SIZE;
    this.logic = new GameLogic(this.state, cellSize);
    this.uiManager = new UIManager();
    this.eventHandler = new EventHandler(
      canvas,
      this.state,
      this.handleSelectionChange.bind(this),
      this.handleSelectionEnd.bind(this),
      config.isMobile
    );
    this.audioManager = new AudioManager();

    this.setupGame();
    this.setupBGMControl();
  }

  private setupGame(): void {
    this.setupStartScreen();
    this.setupColorButtons();
    this.setupGameControls();
  }

  private setupStartScreen(): void {
    const startButton = document.getElementById('startButton');
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');

    startButton?.addEventListener('click', () => {
      if (startScreen && gameScreen) {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        this.startGame();
      }
    });
  }

  private setupColorButtons(): void {
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach((button) => {
      if (button instanceof HTMLElement) {
        button.addEventListener('click', () => {
          const color = button.dataset.color || GAME_CONSTANTS.COLORS.DEFAULT;
          this.logic.updateColor(color);

          colorButtons.forEach((btn) => btn.classList.remove('active'));
          button.classList.add('active');
        });
      }
    });
  }

  private setupGameControls(): void {
    // 취소 버튼
    document.getElementById('cancelBtn')?.addEventListener('click', () => {
      this.cancelGame();
    });

    // 재시작 버튼
    document.getElementById('restartBtn')?.addEventListener('click', () => {
      this.restartGame();
    });

    // 재정렬 버튼
    document.getElementById('shuffleBtn')?.addEventListener('click', () => {
      this.logic.generateTiles();
    });

    // 게임오버 화면 버튼들
    document.getElementById('restartFromOver')?.addEventListener('click', () => {
      this.uiManager.hideGameOver();
      this.restartGame();
    });

    document.getElementById('homeFromOver')?.addEventListener('click', () => {
      this.uiManager.hideGameOver();
      this.cancelGame();
    });
  }

  private setupBGMControl(): void {
    const bgmToggle = document.getElementById('bgmToggle') as HTMLInputElement;
    const volumeSlider = document.getElementById('bgmVolume') as HTMLInputElement;

    // 저장된 설정 불러오기
    const savedBGM = CookieManager.getCookie('bgmEnabled');
    const savedVolume = CookieManager.getCookie('bgmVolume');

    // BGM 상태 설정
    this.isBGMOn = savedBGM ? savedBGM === 'true' : true;
    bgmToggle.checked = this.isBGMOn;

    // 볼륨 설정
    const volume = savedVolume ? parseInt(savedVolume) / 100 : 0.5;
    volumeSlider.value = (volume * 100).toString();
    this.audioManager.setBGMVolume(volume);

    // BGM 토글 이벤트
    bgmToggle.addEventListener('change', () => {
      this.isBGMOn = bgmToggle.checked;
      if (this.isBGMOn) {
        this.audioManager.playBGM();
      } else {
        this.audioManager.stopBGM();
      }
      CookieManager.setCookie('bgmEnabled', this.isBGMOn.toString());
    });

    // 볼륨 조절 이벤트
    volumeSlider.addEventListener('input', () => {
      const volume = parseInt(volumeSlider.value) / 100;
      this.audioManager.setBGMVolume(volume);
      CookieManager.setCookie('bgmVolume', volumeSlider.value);
    });
  }

  private startGame(): void {
    this.logic.resetGame();
    this.eventHandler.enable();
    this.startTimer();
    this.gameLoop();
    if (this.isBGMOn) {
      this.audioManager.playBGM();
    }
  }

  private cancelGame(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.logic.resetGame();
    this.uiManager.resetTimer();
    this.uiManager.resetScore();

    const gameScreen = document.getElementById('gameScreen');
    const startScreen = document.getElementById('startScreen');
    if (gameScreen && startScreen) {
      gameScreen.style.display = 'none';
      startScreen.style.display = 'block';
    }
    this.audioManager.stopBGM();
  }

  private restartGame(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.uiManager.resetTimer();
    this.uiManager.resetScore();
    this.startGame();
  }

  private startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.state.timeRemaining--;
      this.uiManager.updateTimer(this.state.timeRemaining);

      if (this.state.timeRemaining <= 0) {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
        }
        this.endGame();
      }
    }, 1000);
  }

  private endGame(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.eventHandler.disable();
    this.uiManager.showGameOver(this.state.score);
    this.audioManager.stopBGM();
  }

  private handleSelectionChange(start: Position, end: Position): void {
    this.state.selection = { start, end };
  }

  private handleSelectionEnd(): void {
    if (this.state.selection) {
      this.logic.checkSelection(this.state.selection);
      this.uiManager.updateScore(this.state.score);
    }
  }

  private gameLoop(): void {
    this.renderer.clear();
    this.renderer.drawGrid();
    this.renderer.drawTiles(this.state.tiles);

    if (this.state.selection) {
      this.renderer.drawSelection(
        this.state.selection.start,
        this.state.selection.end,
        this.state.tiles
      );
    }

    requestAnimationFrame(() => this.gameLoop());
  }
}
