import EventEmitter from "events";
import {
  messagesSchema,
  onNewMessageSchema,
  sendMessageSchema,
} from "../../schema/message/message.schema";
import { publicProcedure, router } from "../../trpc";
import { Events, __cookieName__ } from "../../constants";
import { verifyJwt } from "../../utils";
import { observable } from "@trpc/server/observable";
import { Message } from "@prisma/client";
const ee = new EventEmitter({
  captureRejections: true,
});

export const messageRouter = router({
  sendMessage: publicProcedure
    .input(sendMessageSchema)
    .mutation(
      async ({ input: { engineId, message }, ctx: { prisma, req } }) => {
        const jwt = req.cookies[__cookieName__];
        if (!!!jwt)
          return {
            error: {
              field: "token",
              message: "you are not authenticated to leave a game engine.",
            },
          };
        try {
          const payload = await verifyJwt(jwt);
          const gamer = await prisma.gamer.findFirst({
            where: { id: payload.id },
          });
          if (!!!gamer)
            return {
              error: {
                field: "gammer",
                message:
                  "unable to leave a game engine because you are not authenticated.",
              },
            };
          const engine = await prisma.engine.findFirst({
            where: { id: engineId },
          });
          if (!!!engine)
            return {
              error: {
                message:
                  "enable to find the game engine/environment it might have been deleted.",
                field: "engine",
              },
            };

          if (engine.gamersIds.indexOf(gamer.id) === -1) {
            return {
              error: {
                message: "you are not part of this engine to send messages.",
                field: "gamer",
              },
            };
          }
          const msg = await prisma.message.create({
            data: {
              message,
              sender: { connect: { id: gamer.id } },
              engine: { connect: { id: engine.id } },
            },
          });

          ee.emit(Events.ON_NEW_MESSAGE, msg);
          return {
            msg,
          };
        } catch (error) {
          console.log({ error });
          return {
            error: {
              field: "server",
              message:
                "something went wrong on the server, would you mind try again the action",
            },
          };
        }
      }
    ),

  messages: publicProcedure
    .input(messagesSchema)
    .query(async ({ ctx: { prisma } }) => {
      const messages = await prisma.message.findMany({
        orderBy: { createdAt: "asc" },
        include: { sender: true },
      });
      return {
        messages,
      };
    }),
  onNewMessage: publicProcedure
    .input(onNewMessageSchema)
    .subscription(({ input: { engineId } }) => {
      return observable<{ message: Message }>((emit) => {
        const handleEvent = async (msg: Message) => {
          if (engineId === msg.engineId) {
            emit.next({ message: msg });
          }
        };
        ee.on(Events.ON_NEW_MESSAGE, handleEvent);
        return () => {
          ee.off(Events.ON_NEW_MESSAGE, handleEvent);
        };
      });
    }),
});
