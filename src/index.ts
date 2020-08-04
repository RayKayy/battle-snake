console.log('Hello, World!');
import fastify from 'fastify';
import routeLoader from './loaders/fastify';

let app = fastify({ logger: true });

app.get(
  '/',
  {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            apiversion: { type: 'string' },
            author: { type: 'string' },
            color: { type: 'string' },
            head: { type: 'string' },
            tail: { type: 'string' },
          },
        },
      },
    },
  },
  (request, reply) => {
    reply.send({ apiversion: '1', author: 'RayKayy' });
  },
);

app = routeLoader(app);

(async () => {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
