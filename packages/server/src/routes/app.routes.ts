import { router } from "../trpc";
import { gameRouter } from "./game/game.router";
import { gamerRouter } from "./gamer/gammer.router";
import { helloRouter } from "./hello/hello.router";

export const appRouter = router({
  hello: helloRouter,
  game: gameRouter,
  gamer: gamerRouter,
});

export type AppRouter = typeof appRouter;
