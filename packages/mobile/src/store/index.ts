import { CardType, Engine, EnvironmentType, Gamer } from "@blackjack/server";
import { create } from "zustand";

export const useGamerStore = create<{
  gamer: Required<Gamer> | null;
  setGamer: (gamer: Required<Gamer> | null) => void;
}>((set) => ({
  gamer: null,
  setGamer: (gamer: Required<Gamer> | null) => set({ gamer: gamer }),
}));

export const useCurrentEngineStore = create<{
  engine: Engine | null;
  setEngine: (engine: Engine | null) => void;
}>((set) => ({
  engine: null,
  setEngine: (engine) => set({ engine }),
}));

export const useEnvironmentStore = create<{
  gamersIds: Array<string>;
  environment: EnvironmentType | null;
  setEnvironment: (env: EnvironmentType) => void;
  setGamersIds: (gamersIds: Array<string>) => void;
  pickCard: (card: CardType, gamerId: string, myId: string) => void;
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
}));
