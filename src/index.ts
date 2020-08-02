console.log('Hello, World!');
import fastify from 'fastify';

const app = fastify({ logger: true });

app.get('/', (req, reply) => {
  reply.send({ hello: 'world' });
});

(async () => {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
