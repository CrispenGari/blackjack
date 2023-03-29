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
  setGamer: (gamer: any) => set({ gamer: gamer }),
}));
