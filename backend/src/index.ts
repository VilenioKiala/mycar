import fastify from "fastify";
import { apiRoutes } from "./presentations/api";

const app = fastify({
  logger: true,
});

app.register(apiRoutes, { prefix: "/api" });

app.listen({ port: 8000 }, (error, address) => {
  if (error) {
    app.log.error(error);

    process.exit(1);
  }
});
