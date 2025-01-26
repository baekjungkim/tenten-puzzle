import { GameState, Position } from './types';
import { GAME_CONSTANTS } from './constants';

export class EventHandler {
  private isEnabled: boolean = true;

  constructor(
    private canvas: HTMLCanvasElement,
    private state: GameState,
    private onSelectionChange: (start: Position, end: Position) => void,
    private onSelectionEnd: () => void,
    private isMobile: boolean = false
  ) {
    this.setupEventListeners();
  }

  private isDragging = false;

  private setupEventListeners(): void {
    if (this.isMobile) {
      this.setupTouchEvents();
    }
    this.setupMouseEvents();
  }

  private setupTouchEvents(): void {
    this.canvas.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        if (!this.isEnabled) return;
        const touch = e.touches[0];
        const pos = this.getTouchPos(touch);
        this.startDragging(pos);
        this.canvas.classList.add('touch-active');
      },
      { passive: false }
    );

    this.canvas.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        if (!this.isEnabled) return;
        if (this.isDragging && this.state.selection) {
          const touch = e.touches[0];
          const pos = this.getTouchPos(touch);
          this.updateSelection(pos);
        }
      },
      { passive: false }
    );

    this.canvas.addEventListener(
      'touchend',
      (e) => {
        e.preventDefault();
        if (!this.isEnabled) return;
        this.endDragging();
        this.canvas.classList.remove('touch-active');
      },
      { passive: false }
    );
  }

  private setupMouseEvents(): void {
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
  }

  private startDragging(pos: Position): void {
    this.isDragging = true;
    this.state.selection = {
      start: pos,
      end: pos,
    };
    this.onSelectionChange(pos, pos);
  }

  private updateSelection(pos: Position): void {
    if (this.state.selection) {
      this.state.selection.end = pos;
      this.onSelectionChange(this.state.selection.start, pos);
    }
  }

  private endDragging(): void {
    if (this.state.selection) {
      this.onSelectionEnd();
    }
    this.isDragging = false;
    this.state.selection = undefined;
  }

  private getMousePos(e: MouseEvent): Position {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private getTouchPos(touch: Touch): Position {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const x = (touch.clientX - rect.left) * scaleX - (this.isMobile ? 10 : 0);
    const y = (touch.clientY - rect.top) * scaleY - (this.isMobile ? 10 : 0);

    return {
      x: Math.max(
        GAME_CONSTANTS.PADDING.LEFT,
        Math.min(x, this.canvas.width - GAME_CONSTANTS.PADDING.RIGHT)
      ),
      y: Math.max(
        GAME_CONSTANTS.PADDING.TOP,
        Math.min(y, this.canvas.height - GAME_CONSTANTS.PADDING.BOTTOM)
      ),
    };
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  private handleMouseDown(e: MouseEvent): void {
    if (!this.isEnabled) return;
    const pos = this.getMousePos(e);
    this.startDragging(pos);
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.isEnabled) return;
    if (this.isDragging && this.state.selection) {
      const pos = this.getMousePos(e);
      this.updateSelection(pos);
    }
  }

  private handleMouseUp(): void {
    if (!this.isEnabled) return;
    this.endDragging();
  }
}
