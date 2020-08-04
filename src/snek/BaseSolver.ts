export const TERRAIN_MAP = {
  FOOD: 1,
  SNAKE: 2,
  HAZARD: 3,
} as const;

export type Coords = {
  x: number;
  y: number;
};

type Arena = number[][];

type Directions = 'up' | 'down' | 'left' | 'right';

// Simple Base Solver
class BaseSolver {
  private _baseArena: Arena;

  public arena: Arena;

  public width: number;

  public height: number;

  public constructor(width: number, height: number) {
    const row = new Array(width).fill(0);
    this.width = width;
    this.height = height;
    this._baseArena = new Array(height).fill([...row]);
    this.arena = JSON.parse(JSON.stringify(this._baseArena));
  }

  private resetArena() {
    this.arena = JSON.parse(JSON.stringify(this._baseArena));
  }

  public updateArena(
    foods: Coords[],
    snakes: Coords[],
    hazards: Coords[],
  ): Arena {
    this.resetArena();
    foods.forEach(({ x, y }) => {
      this.arena[y][x] = TERRAIN_MAP.FOOD;
    });
    snakes.forEach(({ x, y }) => {
      this.arena[y][x] = TERRAIN_MAP.SNAKE;
    });
    hazards.forEach(({ x, y }) => {
      this.arena[y][x] = TERRAIN_MAP.HAZARD;
    });
    return this.arena;
  }

  // To Be Overriden by child classes
  // Will move to first available direction
  public getMove(head: Coords): Directions | null {
    const { x, y } = head;
    const moves = {
      up: { x, y: y + 1 },
      down: { x, y: y - 1 },
      left: { x: x - 1, y },
      right: { x: x + 1, y },
    };
    for (const entry of Object.entries(moves).sort(() => Math.random() - 0.5)) {
      const [direction, { x: newX, y: newY }] = entry;
      if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {
        const newLoc = this.arena[newY][newX];
        if (newLoc !== TERRAIN_MAP.SNAKE && newLoc !== TERRAIN_MAP.HAZARD) {
          return direction as Directions;
        }
      }
    }
    return null;
  }
}

export default BaseSolver;

const x = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
];
