import { z } from "zod";

export const cardSchema = z.object({
  id: z.string(),
  index: z.number(),
  value: z.string(),
});
export const playerSchema = z.object({
  playerId: z.string(),
  nickname: z.string(),
  cards: z.array(cardSchema),
  total: z.number(),
  isCreator: z.boolean().default(false),
});

export const startGameSchema = z.object({
  players: z.array(z.object({ nickname: z.string() })),
  blackJack: z.string(), // J_OF_CLUBS // J_OF_SPADES
});

export const gameSchema = z.object({
  players: z.array(playerSchema),
  blackJack: z.string(),
});

export const createGameEnvironmentSchema = z.object({
  creator: z.object({ nickname: z.string() }),
});

export const joinGameSpaceSchema = z.object({
  gammer: z.object({ nickname: z.string(), engineId: z.string() }),
});

export type CardType = z.TypeOf<typeof cardSchema>;
