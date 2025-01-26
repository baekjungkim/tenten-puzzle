import { Position, Tile } from './types';
import { GAME_CONSTANTS } from './constants';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private boxSize: number;

  constructor(
    private canvas: HTMLCanvasElement,
    isMobile: boolean = false
  ) {
    this.ctx = canvas.getContext('2d')!;
    this.cellSize = isMobile ? GAME_CONSTANTS.CELL.MOBILE_SIZE : GAME_CONSTANTS.CELL.DEFAULT_SIZE;
    this.boxSize = this.cellSize - GAME_CONSTANTS.CELL.BOX_MARGIN * 2;

    // Canvas 크기 설정
    this.canvas.width =
      GAME_CONSTANTS.GRID.WIDTH * this.cellSize +
      GAME_CONSTANTS.PADDING.LEFT +
      GAME_CONSTANTS.PADDING.RIGHT;
    this.canvas.height =
      GAME_CONSTANTS.GRID.HEIGHT * this.cellSize +
      GAME_CONSTANTS.PADDING.TOP +
      GAME_CONSTANTS.PADDING.BOTTOM;
  }

  public clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public drawGrid(): void {
    this.ctx.strokeStyle = '#ddd';
    this.ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= GAME_CONSTANTS.GRID.WIDTH; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.cellSize + GAME_CONSTANTS.PADDING.LEFT, GAME_CONSTANTS.PADDING.TOP);
      this.ctx.lineTo(
        x * this.cellSize + GAME_CONSTANTS.PADDING.LEFT,
        GAME_CONSTANTS.GRID.HEIGHT * this.cellSize + GAME_CONSTANTS.PADDING.TOP
      );
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= GAME_CONSTANTS.GRID.HEIGHT; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(GAME_CONSTANTS.PADDING.LEFT, y * this.cellSize + GAME_CONSTANTS.PADDING.TOP);
      this.ctx.lineTo(
        GAME_CONSTANTS.GRID.WIDTH * this.cellSize + GAME_CONSTANTS.PADDING.LEFT,
        y * this.cellSize + GAME_CONSTANTS.PADDING.TOP
      );
      this.ctx.stroke();
    }
  }

  public drawTiles(tiles: Tile[]): void {
    tiles.forEach((tile) => {
      if (tile.isEmpty) return;

      const x = tile.position.x + GAME_CONSTANTS.PADDING.LEFT - this.boxSize / 2;
      const y = tile.position.y + GAME_CONSTANTS.PADDING.TOP - this.boxSize / 2;

      // Draw box with yellow background if selected
      this.ctx.fillStyle = tile.isSelected
        ? '#FFC107'
        : tile.color || GAME_CONSTANTS.COLORS.DEFAULT;
      this.ctx.fillRect(x, y, this.boxSize, this.boxSize);

      // Draw border
      this.ctx.strokeStyle = tile.isSelected ? '#FFA000' : '#2E7D32';
      this.ctx.lineWidth = tile.isSelected ? 2 : 1;
      this.ctx.strokeRect(x, y, this.boxSize, this.boxSize);

      // Draw number
      this.ctx.fillStyle = this.getContrastColor(
        tile.isSelected ? '#FFC107' : tile.color || GAME_CONSTANTS.COLORS.DEFAULT
      );
      this.ctx.font = 'bold 22px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(tile.value.toString(), x + this.boxSize / 2, y + this.boxSize / 2);
    });
  }

  public drawSelection(start: Position, end: Position, tiles: Tile[]): void {
    const left = Math.min(start.x, end.x);
    const right = Math.max(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const bottom = Math.max(start.y, end.y);

    // 드래그 영역 표시
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(left, top, right - left, bottom - top);

    // 드래그 영역 테두리
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(left, top, right - left, bottom - top);

    // 선택 영역 내의 타일들 강조
    tiles.forEach((tile) => {
      if (tile.isEmpty) return;

      const screenX = tile.position.x + GAME_CONSTANTS.PADDING.LEFT;
      const screenY = tile.position.y + GAME_CONSTANTS.PADDING.TOP;

      if (screenX >= left && screenX <= right && screenY >= top && screenY <= bottom) {
        const x = tile.position.x + GAME_CONSTANTS.PADDING.LEFT - this.boxSize / 2;
        const y = tile.position.y + GAME_CONSTANTS.PADDING.TOP - this.boxSize / 2;

        this.ctx.setLineDash([]); // 실선으로 변경
        this.ctx.strokeStyle = '#FFC107';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, this.boxSize, this.boxSize);
      }
    });

    this.ctx.setLineDash([]); // 대시 스타일 초기화
  }

  private getContrastColor(bgColor: string): string {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  }
}
