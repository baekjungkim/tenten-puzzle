// 게임 내 위치를 나타내는 인터페이스
export interface Position {
  x: number;
  y: number;
}

// 게임판의 각 타일을 나타내는 인터페이스
export interface Tile {
  position: Position; // 타일의 위치
  value: number; // 타일의 숫자 값 (1-9)
  color?: string; // 타일의 색상
  isEmpty: boolean; // 타일이 제거되었는지 여부
  isSelected?: boolean; // 타일이 선택되었는지 여부
}

// 전체 게임 상태를 관리하는 인터페이스
export interface GameState {
  tiles: Tile[]; // 게임판의 모든 타일
  score: number; // 현재 점수
  timeRemaining: number; // 남은 시간
  currentColor: string; // 현재 선택된 타일 색상
  selection?: {
    // 현재 드래그 선택 영역
    start: Position;
    end: Position;
  };
}

// 게임 초기화 설정을 위한 인터페이스
export interface GameConfig {
  canvasId: string; // 캔버스 요소의 ID
  isMobile?: boolean; // 모바일 환경 여부
}
