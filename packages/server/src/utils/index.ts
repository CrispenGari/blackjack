import { Gamer } from "@prisma/client";
import jwt from "jsonwebtoken";

export const shuffle = <T>(values: Array<T>): Array<T> => {
  return values.sort((_) => Math.random() - 0.5);
};

export const shareCards = <T>(array: Array<T>, parts: number) => {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
};

export const signJwt = async ({ id, nickname }: Gamer): Promise<string> => {
  return await jwt.sign(
    {
      id,
      nickname,
    },
    process.env.JWT_SECRETE
  );
};

export const verifyJwt = async (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRETE) as {
    nickname: string;
    id: string;
  };
};
