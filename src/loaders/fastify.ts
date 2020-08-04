import { FastifyInstance } from 'fastify';
import routes from '../routes';

export default (fastify: FastifyInstance) => {
  // Load Routes
  routes.forEach((routeOptions) => fastify.route(routeOptions));
  return fastify;
};
