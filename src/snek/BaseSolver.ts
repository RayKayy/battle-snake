export const TERRAIN_MAP = {
  EMPTY: 0,
  FOOD: 1,
  SNAKE: 2,
  HAZARD: 3,
} as const;

export type Coords = {
  x: number;
  y: number;
};

export type Grid = number[][];

export class Arena {
  public width: number;

  public height: number;

  public grid: Grid;

  private _baseGrid: Grid;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    const row = new Array(width).fill(0);
    this._baseGrid = new Array(height).fill([...row]);
    this.grid = JSON.parse(JSON.stringify(this._baseGrid));
  }

  private resetArena() {
    this.grid = JSON.parse(JSON.stringify(this._baseGrid));
  }

  public update(foods: Coords[], snakes: Coords[], hazards: Coords[]): Grid {
    this.resetArena();
    foods.forEach(({ x, y }) => {
      this.grid[y][x] = TERRAIN_MAP.FOOD;
    });
    snakes.forEach(({ x, y }) => {
      this.grid[y][x] = TERRAIN_MAP.SNAKE;
    });
    hazards.forEach(({ x, y }) => {
      this.grid[y][x] = TERRAIN_MAP.HAZARD;
    });
    return this.grid;
  }
}

export type Directions = 'up' | 'down' | 'left' | 'right';

// Simple Base Solver
class BaseSolver {
  public arena: Arena;

  public constructor(arena: Arena) {
    this.arena = arena;
  }

  // To Be Overriden by child classes
  // Will move to first available direction
  public getMove(head: Coords): Directions | null {
    const { x, y } = head;
    const moves = {
      up: { x, y: y - 1 },
      down: { x, y: y + 1 },
      left: { x: x - 1, y },
      right: { x: x + 1, y },
    };
    for (const entry of Object.entries(moves).sort(() => Math.random() - 0.5)) {
      const [direction, { x: newX, y: newY }] = entry;
      if (
        newX >= 0 &&
        newX < this.arena.width &&
        newY >= 0 &&
        newY < this.arena.height
      ) {
        const newLoc = this.arena.grid[newY][newX];
        console.log(newLoc);
        if (newLoc !== TERRAIN_MAP.SNAKE && newLoc !== TERRAIN_MAP.HAZARD) {
          return direction as Directions;
        }
      }
    }
    return null;
  }
}

export default BaseSolver;
