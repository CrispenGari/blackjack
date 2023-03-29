import { router } from "../trpc";
import { gameRouter } from "./game/game.router";
import { helloRouter } from "./hello/hello.router";

export const appRouter = router({
  hello: helloRouter,
  game: gameRouter,
});

export type AppRouter = typeof appRouter;
