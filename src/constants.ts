export const GAME_CONSTANTS = {
  GRID: {
    WIDTH: 15,
    HEIGHT: 10,
  },
  PADDING: {
    TOP: 50,
    RIGHT: 50,
    BOTTOM: 50,
    LEFT: 50,
  },
  COLORS: {
    DEFAULT: '#4CAF50',
    SUCCESS: '#4CAF50',
    WARNING: '#FFC107',
    DANGER: '#F44336',
  },
  TIME: {
    INITIAL: 120,
    WARNING_THRESHOLD: 60,
    DANGER_THRESHOLD: 30,
  },
  CELL: {
    DEFAULT_SIZE: 50,
    MOBILE_SIZE: 35,
    BOX_MARGIN: 2,
  },
} as const;
