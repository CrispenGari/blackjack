import { z } from "zod";

export const cardSchema = z.object({
  id: z.string(),
  index: z.number(),
  value: z.string(),
});
export const playerSchema = z.object({
  password: z.string(),
  total: z.number(),
  cards: z.array(cardSchema),
  id: z.string(),
  nickname: z.string(),
  loggedIn: z.boolean(),
  enginesIds: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const updateGameEnvironmentSchema = z.object({
  engineId: z.string(),
  blackJack: z.string(),
  played: z.array(cardSchema),
  players: z.array(playerSchema),
  lastPlayer: z.nullable(playerSchema),
});

export const startGameSchema = z.object({
  engineId: z.string(),
  blackJack: z.string(), // J_OF_CLUBS // J_OF_SPADES
});

export const onGameStateChangedSchema = z.object({
  engineId: z.string(),
});

export type CardType = z.TypeOf<typeof cardSchema>;
export type PlayerType = z.TypeOf<typeof playerSchema>;
