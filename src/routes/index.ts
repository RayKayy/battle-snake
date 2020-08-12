import { RouteOptions } from 'fastify';
import BaseSolver, { Coords, Arena } from '../snek/BaseSolver';
import BfsSolver from '../snek/BfsSolver';

const COORDS_SCHEMA = {
  type: 'object',
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
  },
};

const BATTLESNAKE_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    health: { type: 'number' },
    body: {
      type: 'array',
      items: COORDS_SCHEMA,
    },
    head: COORDS_SCHEMA,
    length: { type: 'number' },
    shout: { type: 'string' },
  },
};

const BOARD_SCHEMA = {
  type: 'object',
  properties: {
    height: { type: 'number' },
    width: { type: 'number' },
    food: { type: 'array', items: COORDS_SCHEMA },
    hazards: { type: 'array', items: COORDS_SCHEMA },
    snakes: { type: 'array', items: BATTLESNAKE_SCHEMA },
  },
};

const BS_V1_REQ_BODY_SCHEMA = {
  game: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      timeout: { type: 'number' },
    },
  },
  turn: { type: 'number' },
  board: BOARD_SCHEMA,
  you: BATTLESNAKE_SCHEMA,
};

const SOLVER_CLASS_MAP = {
  bfs: BfsSolver,
  dumb: BaseSolver,
};

const STATE: Record<string, BaseSolver | BfsSolver> = {};

const routes: RouteOptions[] = [
  {
    url: '/:solver/start',
    method: 'POST',
    schema: {
      body: BS_V1_REQ_BODY_SCHEMA,
    },
    handler: (request: any, reply) => {
      const {
        game: { id, timeout },
        board: { width, height, hazards, snakes, food },
      } = request.body as any;

      console.log(
        SOLVER_CLASS_MAP[
          request.params.solver as keyof typeof SOLVER_CLASS_MAP
        ],
      );

      STATE[id] = new SOLVER_CLASS_MAP[
        request.params.solver as keyof typeof SOLVER_CLASS_MAP
      ](new Arena(width, height));
      // STATE[id] = new BfsSolver(new Arena(width, height));
      STATE[id].arena.update(
        food,
        snakes.reduce((acc: Coords[], snake: any) => {
          acc.push(...snake.body);
          return acc;
        }, []),
        hazards,
      );
      console.log(STATE[id]);
      reply.send();
    },
  },
  {
    url: '/:solver/end',
    method: 'POST',
    schema: {
      body: BS_V1_REQ_BODY_SCHEMA,
    },
    handler: (request, reply) => {
      const {
        game: { id, timeout },
        board: { hazards, snakes, food },
      } = request.body as any;
      STATE[id].arena.update(
        food,
        snakes.reduce((acc: Coords[], snake: any) => {
          acc.push(...snake.body);
          return acc;
        }, []),
        hazards,
      );
      delete STATE[id];
      reply.send();
    },
  },
  {
    url: '/:solver/move',
    method: 'POST',
    schema: {
      body: BS_V1_REQ_BODY_SCHEMA,
      response: {
        move: {
          type: 'string',
          enum: ['up', 'down', 'left', 'right'],
        },
        shout: { type: 'string' },
      },
    },
    handler: (request, reply) => {
      const {
        game: { id, timeout },
        board: { hazards, snakes, food },
        you: { head },
      } = request.body as any;
      STATE[id].arena.update(
        food,
        snakes.reduce((acc: Coords[], snake: any) => {
          acc.push(...snake.body);
          return acc;
        }, []),
        hazards,
      );
      const move = STATE[id].getMove(head);
      console.log(move);
      reply.send({ move, shout: `Base Avoidance Move: ${move}` });
    },
  },
];

export default routes;
