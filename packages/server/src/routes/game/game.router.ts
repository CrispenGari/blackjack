import { Engine } from "@prisma/client";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";
import { CARDS, Events } from "../../constants";
import {
  CardType,
  onGameStateChangedSchema,
  onGameStartSchema,
  startGameSchema,
  updateGameEnvironmentSchema,
  playerSchema,
  updateNextPlayerSchema,
} from "../../schema/game/game.schema";
import { publicProcedure, router } from "../../trpc";
import { shareCards, shuffle } from "../../utils";

export type GamePayLoadType = z.TypeOf<typeof updateGameEnvironmentSchema>;
export type GamerType = z.TypeOf<typeof playerSchema>;

const ee = new EventEmitter({
  captureRejections: true,
});

export const gameRouter = router({
  onGameStart: publicProcedure
    .input(onGameStartSchema)
    .subscription(({ input: { engineId, gamerId } }) => {
      return observable<{ message: string }>((emit) => {
        const handleEvent = async ({ engine }: { engine: Engine }) => {
          if (engineId === engine.id && engine.adminId !== gamerId) {
            emit.next({ message: "the game has started." });
          }
        };
        ee.on(Events.ON_GAME_START, handleEvent);
        return () => {
          ee.off(Events.ON_GAME_START, handleEvent);
        };
      });
    }),
  pickCard: publicProcedure.mutation(() => true),
  play: publicProcedure.mutation(() => true),
  updateGameEnvironment: publicProcedure
    .input(updateGameEnvironmentSchema)
    .mutation(({ input }) => {
      ee.emit(Events.ON_GAME_STATE_CHANGE, input);
    }),
  updateNextPlayer: publicProcedure
    .input(updateNextPlayerSchema)
    .mutation(({ input: { env, last, next } }) => {
      const payload: GamePayLoadType = {
        ...env,
        last,
        next,
      };
      ee.emit(Events.ON_GAME_STATE_CHANGE, payload);
    }),
  startGame: publicProcedure
    .input(startGameSchema)
    .mutation(
      async ({
        input: { engineId, blackJack, backCover },
        ctx: { prisma },
      }) => {
        const engine = await prisma.engine.findFirst({
          where: {
            id: engineId,
          },
          include: {
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

        const nPlayers: number = engine.gamersIds.length;
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
        const gamers = await prisma.gamer.findMany({
          where: { id: { in: engine.gamersIds } },
        });

        /**
         * shuffle the game gamers and assign them some numbers.
         */
        const gamePlayers = gamers
          .sort(() => Math.random() - 0.5)
          .map((gamer, index) => ({
            ...gamer,
            password: "<hidden>",
            total: potions[index].length,
            cards: potions[index],
            playerNumber: index + 1,
          }));

        await prisma.engine.update({
          where: { id: engine.id },
          data: {
            active: true,
            playing: true,
          },
        });
        const payload: GamePayLoadType = {
          engineId: engine.id,
          blackJack,
          backCover,
          players: gamePlayers,
          played: [],
          last: null,
          next: { ...gamePlayers[0] },
        };
        ee.emit(Events.ON_GAME_STATE_CHANGE, payload);
        ee.emit(Events.ON_ENGINE_STATE_CHANGE, payload);
        ee.emit(Events.ON_GAME_START, { engine });
        return {
          blackJack,
          players: gamePlayers,
        };
      }
    ),
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
