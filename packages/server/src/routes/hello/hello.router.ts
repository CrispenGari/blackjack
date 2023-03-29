import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";
import { CARDS } from "../../constants";
import { publicProcedure, router } from "../../trpc";
const ee = new EventEmitter();
export const helloRouter = router({
  cards: publicProcedure.query(({}) => CARDS),
  noti: publicProcedure.subscription(({}) => {
    return observable<string>((emit) => {
      const onMessage = (msg: string) => {
        emit.next(msg);
      };
      ee.on("hello", onMessage);
      return () => {
        ee.off("hello", onMessage);
      };
    });
  }),
  greeting: publicProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(3, { message: "minimum of 3 characters" })
          .max(100, { message: "maximum of 10 characters" }),
      })
    )
    .output(z.object({ message: z.string() }))
    .query(({ ctx, input: { name } }) => {
      return {
        message: `Hello ${name}`,
      };
    }),
  fromTRPC: publicProcedure.query(({ ctx }) => {
    ee.emit("hello", "hello there");
    return "Hello from TRPC";
  }),
});
