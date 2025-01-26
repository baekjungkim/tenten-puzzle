import { GameState, Tile, Position } from './types';
import { GAME_CONSTANTS } from './constants';

export class GameLogic {
  constructor(
    private state: GameState,
    private cellSize: number = GAME_CONSTANTS.CELL.DEFAULT_SIZE
  ) {}

  public generateTiles(): void {
    this.state.tiles = [];
    for (let y = 0; y < GAME_CONSTANTS.GRID.HEIGHT; y++) {
      for (let x = 0; x < GAME_CONSTANTS.GRID.WIDTH; x++) {
        const position = {
          x: x * this.cellSize + this.cellSize / 2,
          y: y * this.cellSize + this.cellSize / 2,
        };

        const value = Math.floor(Math.random() * 9) + 1;

        this.state.tiles.push({
          position,
          value,
          color: this.state.currentColor,
          isEmpty: false,
        });
      }
    }
  }

  public checkSelection(selection: { start: Position; end: Position }): boolean {
    const selectedTiles = this.getTilesInSelection(selection);

    // 최소 2개 이상 선택해야 함
    if (selectedTiles.length < 2) return false;

    // 동일한 숫자 체크
    const firstValue = selectedTiles[0].value;
    const allSameValue = selectedTiles.every((tile) => tile.value === firstValue);

    // 합이 10인지 체크
    const sum = selectedTiles.reduce((acc, tile) => acc + tile.value, 0);

    // 동일한 숫자이거나 합이 10이면 점수 부여
    if (allSameValue || sum === 10) {
      this.state.score += selectedTiles.length;
      this.removeTiles(selectedTiles);
      this.checkAndRefillBoard();
      return true;
    }
    return false;
  }

  private getTilesInSelection(selection: { start: Position; end: Position }): Tile[] {
    const { start, end } = selection;
    const left = Math.min(start.x, end.x);
    const right = Math.max(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const bottom = Math.max(start.y, end.y);

    return this.state.tiles.filter((tile) => {
      const screenX = tile.position.x + GAME_CONSTANTS.PADDING.LEFT;
      const screenY = tile.position.y + GAME_CONSTANTS.PADDING.TOP;
      return (
        !tile.isEmpty && screenX >= left && screenX <= right && screenY >= top && screenY <= bottom
      );
    });
  }

  private removeTiles(tilesToRemove: Tile[]): void {
    for (const tile of tilesToRemove) {
      const index = this.state.tiles.indexOf(tile);
      if (index > -1) {
        this.state.tiles[index] = {
          ...tile,
          isEmpty: true,
          value: 0,
        };
      }
    }
  }

  private checkAndRefillBoard(): void {
    const isEmpty = this.state.tiles.every((tile) => tile.isEmpty);
    if (isEmpty) {
      this.state.tiles = this.state.tiles.map((tile) => ({
        ...tile,
        isEmpty: false,
        value: Math.floor(Math.random() * 9) + 1,
        color: this.state.currentColor,
      }));
    }
  }

  public updateColor(color: string): void {
    this.state.currentColor = color;
    if (this.state.tiles.length > 0) {
      this.state.tiles = this.state.tiles.map((tile) => {
        if (!tile.isEmpty) {
          return { ...tile, color: this.state.currentColor };
        }
        return tile;
      });
    }
  }

  public resetGame(): void {
    this.state.score = 0;
    this.state.timeRemaining = GAME_CONSTANTS.TIME.INITIAL;
    this.state.selection = undefined;
    this.generateTiles();
  }
}
