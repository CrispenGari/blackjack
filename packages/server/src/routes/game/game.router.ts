import { CARDS } from "../../constants";
import {
  CardType,
  createGameEnvironmentSchema,
  gameSchema,
  joinGameSpaceSchema,
  startGameSchema,
} from "../../schema/game/game.schema";
import { publicProcedure, router } from "../../trpc";
import { shareCards, shuffle } from "../../utils";
import { v4 as uuid_v4 } from "uuid";

const gameEngines = [];
export const gameRouter = router({
  createGameEngine: publicProcedure
    .input(createGameEnvironmentSchema)
    .mutation(({ input: { creator } }) => {
      if (creator.nickname.length < 3)
        return {
          error: {
            field: "nickname",
            message: "nickname is too short.",
          },
        };
      const gameEngine = {
        id: uuid_v4(),
        players: [
          {
            playerId: uuid_v4(),
            nickname: creator.nickname,
            total: 0,
            cards: [],
          },
        ],
      };
      gameEngines.push(gameEngine);
      return {
        gameEngine,
      };
    }),
  joinGameSpace: publicProcedure.input(joinGameSpaceSchema).mutation(
    ({
      input: {
        gammer: { engineId, nickname },
      },
    }) => {
      if (nickname.length < 3)
        return {
          error: {
            field: "nickname",
            message: "nickname is too short.",
          },
        };
    }
  ),

  pickCard: publicProcedure.mutation(() => true),
  play: publicProcedure.mutation(() => true),
  startGame: publicProcedure
    .input(startGameSchema)
    .output(gameSchema)
    .mutation(async ({ input: { players, blackJack } }) => {
      let gameCards = shuffle<CardType>(
        CARDS.filter((card) => card.id !== blackJack)
      );
      const nPlayers: number = players.length;
      const potions = shareCards<CardType>(gameCards, nPlayers);
      const gamePlayers = players.map(({ nickname }, index) => ({
        playerId: uuid_v4(),
        nickname,
        total: potions[index].length,
        cards: potions[index],
      }));
      return {
        blackJack,
        players: gamePlayers,
      };
    }),
});
