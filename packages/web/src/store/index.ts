import { CardType, EnvironmentType, GamerType } from "@blackjack/server";
import { create } from "zustand";

export const useGamerStore = create<{
  gamer: GamerType | null;
  setGamer: (gamer: GamerType | null) => void;
}>((set) => ({
  gamer: null,
  setGamer: (gamer: GamerType | null) => set({ gamer: gamer }),
}));

export const useEnvironmentStore = create<{
  gamersIds: Array<string>;
  environment: EnvironmentType | null;
  setEnvironment: (env: EnvironmentType) => void;
  setGamersIds: (gamersIds: Array<string>) => void;
  pickCard: (card: CardType, gamerId: string, myId: string) => void;
  matchCards: (
    cards: CardType[],
    gamerId: string,
    last: GamerType,
    next: GamerType
  ) => void;
}>((set) => ({
  environment: null,
  gamersIds: [],
  setGamersIds: (gamersIds: string[]) =>
    set((basket) => ({
      ...basket,
      gamersIds,
    })),
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
  matchCards: (
    cards: CardType[],
    gamerId: string,
    last: GamerType,
    next: GamerType
  ) =>
    set((basket) => {
      if (!!basket.environment) {
        const played = [
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
            last,
            next,
            played,
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
