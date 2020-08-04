import { RouteOptions } from 'fastify';
import BaseSolver, { Coords } from '../snek/BaseSolver';

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

const STATE: Record<string, BaseSolver> = {};

const routes: RouteOptions[] = [
  {
    url: '/start',
    method: 'POST',
    schema: {
      body: BS_V1_REQ_BODY_SCHEMA,
    },
    handler: (request, reply) => {
      const {
        game: { id, timeout },
        board: { width, height, hazards, snakes, food },
      } = request.body as any;
      STATE[id] = new BaseSolver(width, height);
      STATE[id].updateArena(
        food,
        snakes.reduce((acc: Coords[], snake: any) => {
          acc.push(...snake.body);
          return acc;
        }, []),
        hazards,
      );
      reply.send();
    },
  },
  {
    url: '/end',
    method: 'POST',
    schema: {
      body: BS_V1_REQ_BODY_SCHEMA,
    },
    handler: (request, reply) => {
      const {
        game: { id, timeout },
        board: { hazards, snakes, food },
      } = request.body as any;
      STATE[id].updateArena(
        food,
        snakes.reduce((acc: Coords[], snake: any) => {
          acc.push(...snake.body);
          return acc;
        }, []),
        hazards,
      );
      console.log(STATE[id].arena);
      delete STATE[id];
      reply.send();
    },
  },
  {
    url: '/move',
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
      STATE[id].updateArena(
        food,
        snakes.reduce((acc: Coords[], snake: any) => {
          acc.push(...snake.body);
          return acc;
        }, []),
        hazards,
      );
      const move = STATE[id].getMove(head);
      console.log(STATE[id].arena);
      reply.send({ move, shout: `Base Avoidance Move: ${move}` });
    },
  },
];

export default routes;
