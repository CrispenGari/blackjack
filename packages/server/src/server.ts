import "dotenv/config";
import _ from "node-env-types";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { createContext as cc } from "./context";
export { type AppRouter } from "./routes/app.routes";
import { appRouter as ar } from "./routes/app.routes";
import Fastify from "fastify";
import cors from "@fastify/cors";
import ws from "@fastify/websocket";
import cookie from "@fastify/cookie";

export const createContext = cc;
export const appRouter = ar;

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
    secret: "my-secrete",
    parseOptions: {
      httpOnly: true,
    },
  });
  fastify.register(ws);
  fastify.register(fastifyTRPCPlugin, {
    prefix: "/api/trpc",
    trpcOptions: { router: ar, createContext: cc },
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
