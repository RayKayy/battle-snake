import BaseSolver, {
  Coords,
  Grid,
  Arena,
  Directions,
  TERRAIN_MAP,
} from './BaseSolver';

class Node {
  public x: number;

  public y: number;

  public parent?: Node;

  constructor(x: number, y: number, parent?: Node) {
    this.x = x;
    this.y = y;
    this.parent = parent;
  }

  arenaValue(arena: Arena) {
    return arena.grid[this.y][this.x];
  }

  get key() {
    return `${this.x},${this.y}`;
  }

  getNeighbours(arena: Arena) {
    const neighbours: Node[] = [];
    const directions = {
      up: [this.x, this.y + 1],
      down: [this.x, this.y - 1],
      left: [this.x - 1, this.y],
      right: [this.x + 1, this.y],
    };
    Object.values(directions).forEach(([x, y]) => {
      // If within bounds
      if (x < arena.width && y < arena.height && x >= 0 && y >= 0) {
        neighbours.push(new Node(x, y, this));
      }
    });
    return neighbours;
  }
}

const getCoordsPath = (endNode: Node, path: Coords[] = []): Coords[] => {
  const { x, y } = endNode;
  const updatedPath = [{ x, y }, ...path];
  if (!endNode.parent) {
    return updatedPath;
  } else {
    return getCoordsPath(endNode.parent, updatedPath);
  }
};

const getNodePath = (endNode: Node, path: Node[] = []): Node[] => {
  const updatedPath = [endNode, ...path];
  if (!endNode.parent) {
    return updatedPath;
  } else {
    return getNodePath(endNode.parent, updatedPath);
  }
};

class BfsSolver extends BaseSolver {
  public getMove({ x, y }: Coords): Directions | null {
    console.log('BFS GET MOVE');
    const startNode = new Node(x, y);
    const nodePath = this.solve(startNode, TERRAIN_MAP.FOOD);
    // nodePath.push(...this.solve(nodePath.pop()!,TERRAIN_MAP.FOOD))
    const directionsMap: Record<string, Directions> = {
      [`${x},${y - 1}`]: 'up',
      [`${x},${y + 1}`]: 'down',
      [`${x - 1},${y}`]: 'left',
      [`${x + 1},${y}`]: 'right',
    };
    return nodePath.length > 1
      ? directionsMap[nodePath[1].key]
      : super.getMove({ x, y });
  }

  private solve(
    startNode: Node,
    targetValue: typeof TERRAIN_MAP[keyof typeof TERRAIN_MAP],
  ) {
    const visited: Map<string, boolean> = new Map();
    const queue: Node[] = [startNode];
    visited.set(startNode.key, true);
    // Start Processing Queue
    while (queue.length) {
      const node = queue.shift()!;
      if (node.arenaValue(this.arena) === targetValue) {
        return getNodePath(node);
      }
      const neighbourNodes = node.getNeighbours(this.arena);
      neighbourNodes.forEach((n) => {
        const terrainValue = n.arenaValue(this.arena);
        // Skip Obstacles
        if (
          terrainValue !== TERRAIN_MAP.EMPTY &&
          terrainValue !== TERRAIN_MAP.FOOD
        ) {
          visited.set(n.key, true);
        }
        // Enqueue Viable Neighbours
        if (!visited.get(n.key)) {
          visited.set(n.key, true);
          queue.push(n);
        }
      });
    }
    return [];
  }
}

export default BfsSolver;
