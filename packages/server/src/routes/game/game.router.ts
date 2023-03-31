import { Engine } from "@prisma/client";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";
import { CARDS, Events } from "../../constants";
import {
  CardType,
  onGameStateChangedSchema,
  startGameSchema,
  updateGameEnvironmentSchema,
} from "../../schema/game/game.schema";
import { publicProcedure, router } from "../../trpc";
import { shareCards, shuffle } from "../../utils";

export type GamePayLoadType = z.TypeOf<typeof updateGameEnvironmentSchema>;

const ee = new EventEmitter({
  captureRejections: true,
});

export const gameRouter = router({
  pickCard: publicProcedure.mutation(() => true),
  play: publicProcedure.mutation(() => true),
  updateGameEnvironment: publicProcedure
    .input(updateGameEnvironmentSchema)
    .mutation(({ input }) => {
      ee.emit(Events.ON_GAME_STATE_CHANGE, input);
    }),
  startGame: publicProcedure
    .input(startGameSchema)
    .mutation(async ({ input: { engineId, blackJack }, ctx: { prisma } }) => {
      const engine = await prisma.engine.findFirst({
        where: {
          id: engineId,
        },
        include: {
          gamers: true,
          messages: {
            include: {
              sender: true,
            },
          },
        },
      });
      if (!!!engine)
        return {
          error: { field: "engine", message: "Failed to find the engine." },
        };

      const nPlayers: number = engine.gamers.length;
      if (nPlayers < 2)
        return {
          error: {
            field: "players",
            message: "You can't start the game alone.",
          },
        };

      const unselected =
        blackJack === "J_OF_CLUBS" ? "J_OF_SPADES" : "J_OF_CLUBS";
      const gameCards = shuffle<CardType>(
        CARDS.filter((card) => card.id !== unselected)
      );
      const potions = shareCards<CardType>(gameCards, nPlayers);
      const gamePlayers = engine.gamers.map((gamer, index) => ({
        ...gamer,
        password: "<hidden>",
        total: potions[index].length,
        cards: potions[index],
      }));

      await prisma.engine.update({
        where: { id: engine.id },
        data: {
          active: true,
          playing: true,
        },
      });
      const payload = {
        engineId: engine.id,
        blackJack,
        players: gamePlayers,
        played: [],
      };
      ee.emit(Events.ON_GAME_STATE_CHANGE, payload);
      ee.emit(Events.ON_ENGINE_STATE_CHANGE, payload);
      return {
        blackJack,
        players: gamePlayers,
      };
    }),
  onGameStateChanged: publicProcedure
    .input(onGameStateChangedSchema)
    .subscription(({ input: { engineId } }) => {
      return observable<{ gameData: GamePayLoadType }>((emit) => {
        const handleEvent = async (payload: GamePayLoadType) => {
          if (engineId === payload.engineId) {
            emit.next({ gameData: payload });
          }
        };
        ee.on(Events.ON_GAME_STATE_CHANGE, handleEvent);
        return () => {
          ee.off(Events.ON_GAME_STATE_CHANGE, handleEvent);
        };
      });
    }),
});
