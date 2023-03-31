import "dotenv/config";
import _ from "node-env-types";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
export { type AppRouter } from "./routes/app.routes";
export { type GamePayLoadType as EnvironmentType } from "./routes/game/game.router";

import Fastify from "fastify";
import cors from "@fastify/cors";
import ws from "@fastify/websocket";
import cookie from "@fastify/cookie";
import { createContext } from "./context";
import { appRouter } from "./routes/app.routes";
export { type CardType } from "./schema/game/game.schema";
export { Engine, Message, Gamer } from "@prisma/client";
_();

const PORT: any = process.env.PORT || 3001;
const HOST =
  process.env.NODE_ENV === "production"
    ? "0.0.0.0"
    : "localhost" || "127.0.0.1";

(async () => {
  const fastify = Fastify({
    logger: false,
    ignoreTrailingSlash: true,
    maxParamLength: 5000,
  });

  fastify.register(cors, {
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3002"],
  });
  fastify.register(cookie, {
    secret: process.env.COOKIE_SECRETE,
    parseOptions: {
      httpOnly: true,
    },
  });
  fastify.register(ws);
  fastify.register(fastifyTRPCPlugin, {
    prefix: "/api/trpc",
    trpcOptions: { router: appRouter, createContext: createContext },
    useWSS: true,
  });

  fastify.listen({ port: PORT, host: HOST }, (error, address) => {
    if (error) {
      console.log(error);
      process.exit(1);
    }
    console.log(` Server is now listening on ${address}`);
  });
})();
