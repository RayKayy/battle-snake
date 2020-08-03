import { FastifyInstance } from 'fastify';

export default (fastify: FastifyInstance) => {
  fastify.post('/start', (request, reply) => {
    console.log(request);
    reply.send();
  });
};
