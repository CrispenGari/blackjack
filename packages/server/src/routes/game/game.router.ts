import { CARDS } from "../../constants";
import {
  CardType,
  gameSchema,
  startGameSchema,
} from "../../schema/game/game.schema";
import { publicProcedure, router } from "../../trpc";
import { shareCards, shuffle } from "../../utils";
import { v4 as uuid_v4 } from "uuid";
export const gameRouter = router({
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
