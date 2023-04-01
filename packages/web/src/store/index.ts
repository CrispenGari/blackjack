import { CardType, EnvironmentType } from "@blackjack/server";
import { create } from "zustand";

type GamerType = {
  password: string;
  id?: string | undefined;
  nickname?: string | undefined;
  loggedIn?: boolean | undefined;
  engineId?: string | null | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
} | null;

export const useGamerStore = create<{
  gamer: GamerType;
  setGamer: (gamer: GamerType) => void;
}>((set) => ({
  gamer: null,
  setGamer: (gamer: GamerType) => set({ gamer: gamer }),
}));

export const useEnvironmentStore = create<{
  environment: EnvironmentType | null;
  setEnvironment: (env: EnvironmentType) => void;
  pickCard: (card: CardType, gamerId: string, myId: string) => void;
  matchCards: (cards: CardType[], gamerId: string, lastPlayer: string) => void;
}>((set) => ({
  environment: null,
  setEnvironment: (env: EnvironmentType) => set({ environment: env }),
  pickCard: (card: CardType, gamerId: string, myId: string) =>
    set((basket) => {
      if (!!basket.environment) {
        return {
          ...basket,
          environment: {
            ...basket.environment,

            players: [
              ...basket.environment?.players.map((player) => {
                if (player.id === gamerId) {
                  // removing the card from a player
                  return {
                    ...player,
                    cards: player.cards.filter((c) => card.id !== c.id),
                  };
                }
                if (player.id === myId) {
                  // adding a card to a player
                  return {
                    ...player,
                    cards: [card, ...player.cards],
                  };
                }
                return {
                  ...player,
                };
              }),
            ],
          },
        };
      }
      return {};
    }),
  matchCards: (cards: CardType[], gamerId: string, lastPlayer: string) =>
    set((basket) => {
      if (!!basket.environment) {
        const unique = [
          ...new Map(
            [...basket.environment.played, ...cards].map((item) => [
              item["id"],
              item,
            ])
          ).values(),
        ];
        return {
          ...basket,
          environment: {
            ...basket.environment,
            lastPlayer: lastPlayer,
            played: unique,
            players: basket.environment.players.map((player) => {
              if (player.id === gamerId) {
                // it's your cards
                const cardIds: string[] = cards.map((c) => c.id);
                return {
                  ...player,
                  cards: player.cards.filter(
                    (card) => !cardIds.includes(card.id)
                  ),
                };
              } else {
                return { ...player };
              }
            }),
          },
        };
      }
      return {
        ...basket,
        environment: null,
      };
    }),
}));
