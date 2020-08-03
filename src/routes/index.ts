import { RouteOptions } from 'fastify';

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

const routes: RouteOptions[] = [
  {
    url: '/start',
    method: 'POST',
    schema: {
      body: BS_V1_REQ_BODY_SCHEMA,
    },
    handler: (request, reply) => {
      console.log(request.body);
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
      console.log(request.body);
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
      console.log(request.body);
      reply.send();
    },
  },
];

export default routes;
