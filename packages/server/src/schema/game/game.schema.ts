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
  createdAt: z.date(),
  updatedAt: z.date(),
  playerNumber: z.number(),
});
export const positionsSchema = z.object({
  nickname: z.string(),
  position: z.number(),
  points: z.number(),
});
export const updateGameEnvironmentSchema = z.object({
  engineId: z.string(),
  blackJack: z.string(),
  backCover: z.string(),
  played: z.array(cardSchema),
  players: z.array(playerSchema),
  last: playerSchema.nullable(),
  next: playerSchema.nullable(),
  positions: z.array(positionsSchema),
});

export const updateNextPlayerSchema = z.object({
  env: updateGameEnvironmentSchema,
  last: playerSchema.nullable(),
  next: playerSchema.nullable(),
});

export const updateGamePositionsSchema = z.object({
  env: updateGameEnvironmentSchema,
  winner: playerSchema,
});

export const matchCardsSchema = z.object({
  env: updateGameEnvironmentSchema,
  last: playerSchema.nullable(),
  next: playerSchema.nullable(),
  cards: z.array(cardSchema),
  gamerId: z.string(),
});

export const startGameSchema = z.object({
  engineId: z.string(),
  blackJack: z.string(),
  // J_OF_CLUBS // J_OF_SPADES
  backCover: z.string(),
});
export const removeGamerSchema = z.object({
  gamerId: z.string(),
});
export const gamersSchema = z.object({
  ids: z.array(z.string()),
});

export const onGameStateChangedSchema = z.object({
  engineId: z.string(),
});
export const onGameOverSchema = z.object({
  engineId: z.string(),
});
export const onGameStartSchema = z.object({
  engineId: z.string(),
  gamerId: z.string(),
});
export const onGamerRemovedSchema = z.object({
  engineId: z.string(),
  gamerId: z.string(),
});
export const onUpdateGamePositionsSchema = z.object({
  engineId: z.string(),
  gamerId: z.string(),
});

export type CardType = z.TypeOf<typeof cardSchema>;
