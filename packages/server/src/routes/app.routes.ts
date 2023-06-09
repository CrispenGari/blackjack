import { router } from "../trpc";
import { engineRouter } from "./engine/engine.router";
import { gameRouter } from "./game/game.router";
import { gamerRouter } from "./gamer/gammer.router";
import { helloRouter } from "./hello/hello.router";
import { messageRouter } from "./message/message.router";

export const appRouter = router({
  hello: helloRouter,
  game: gameRouter,
  gamer: gamerRouter,
  engine: engineRouter,
  message: messageRouter,
});

export type AppRouter = typeof appRouter;
