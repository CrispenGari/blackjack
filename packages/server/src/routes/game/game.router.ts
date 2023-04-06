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
  matchCardsSchema,
  updateGamePositionsSchema,
  onUpdateGamePositionsSchema,
  onGameOverSchema,
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

  onGameOver: publicProcedure
    .input(onGameOverSchema)
    .subscription(({ input: { engineId } }) => {
      return observable<{ environment: GamePayLoadType }>((emit) => {
        const handleEvent = async (payload: GamePayLoadType) => {
          if (engineId === payload.engineId) {
            emit.next({ environment: payload });
          }
        };
        ee.on(Events.ON_GAME_OVER, handleEvent);
        return () => {
          ee.off(Events.ON_GAME_OVER, handleEvent);
        };
      });
    }),
  onUpdateGamePositions: publicProcedure
    .input(onUpdateGamePositionsSchema)
    .subscription(({ input: { engineId, gamerId } }) => {
      return observable<{ message: string }>((emit) => {
        const handleEvent = async ({
          engineId: id,
          playerId,
          nickname,
        }: {
          engineId: string;
          playerId: string;
          nickname: string;
        }) => {
          if (engineId === id) {
            playerId === gamerId
              ? emit.next({
                  message:
                    "You are out of the game, wait for other players to finish the game to get positions.",
                })
              : emit.next({ message: `${nickname} is out of the game.` });
          }
        };
        ee.on(Events.ON_UPDATE_GAME_POSITIONS, handleEvent);
        return () => {
          ee.off(Events.ON_UPDATE_GAME_POSITIONS, handleEvent);
        };
      });
    }),

  updateGamePositions: publicProcedure
    .input(updateGamePositionsSchema)
    .mutation(({ input: { winner, env } }) => {
      try {
        // players that are left in the game.
        const players = env.players
          .filter((player) => player.id !== winner.id)
          .sort((a, b) => a.playerNumber - b.playerNumber)
          .map((player, index) => ({
            ...player,
            playerNumber: index + 1,
          }));
        // get the next and previous player
        const next =
          players.length === 1 ? null : players[winner.playerNumber - 1];
        const last =
          players.length === 1 ? null : players[winner.playerNumber - 2];

        const positions =
          players.length === 1
            ? [
                ...env.positions,
                {
                  nickname: winner.nickname,
                  points: 0,
                  position: env.positions.length + 1,
                },
                {
                  nickname: players[0].nickname,
                  points: 0,
                  position: env.positions.length + 2,
                },
              ]
            : [
                ...env.positions,
                {
                  nickname: winner.nickname,
                  points: 0,
                  position: env.positions.length + 1,
                },
              ];
        const payload: GamePayLoadType = {
          ...env,
          next,
          last,
          players: players.length === 1 ? [] : players,
          positions,
        };
        ee.emit(Events.ON_GAME_STATE_CHANGE, payload);
        ee.emit(Events.ON_UPDATE_GAME_POSITIONS, {
          engineId: env.engineId,
          playerId: winner.id,
          nickname: winner.nickname,
        });
        if (players.length === 1) {
          ee.emit(Events.ON_GAME_OVER, payload);
        }
      } catch (error: any) {
        console.error(error.message);
      }
    }),
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
  matchCards: publicProcedure
    .input(matchCardsSchema)
    .mutation(({ input: { env, last, next, cards, gamerId } }) => {
      const played = [
        ...new Map(
          [...env.played, ...cards].map((item) => [item["id"], item])
        ).values(),
      ];
      const payload: GamePayLoadType = {
        ...env,
        last,
        next,
        played,
        players: env.players.map((player) => {
          if (player.id === gamerId) {
            // it's your cards
            const cardIds: string[] = cards.map((c) => c.id);
            return {
              ...player,
              cards: player.cards.filter((card) => !cardIds.includes(card.id)),
            };
          } else {
            return { ...player };
          }
        }),
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
          positions: [],
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
