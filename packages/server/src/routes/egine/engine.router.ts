import { Engine } from "@prisma/client";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { Events, __cookieName__ } from "../../constants";
import {
  createEngineSchema,
  engineSchema,
  joinEngineSchema,
  onEngineStateChangedSchema,
} from "../../schema/engine/engine.schema";
import { publicProcedure, router } from "../../trpc";
import { verifyJwt } from "../../utils";
const ee = new EventEmitter({
  captureRejections: true,
});
export const engineRouter = router({
  joinEngine: publicProcedure
    .input(joinEngineSchema)
    .mutation(async ({ ctx: { prisma, req }, input: { engineId } }) => {
      const jwt = req.cookies[__cookieName__];
      if (!!!jwt)
        return {
          error: {
            field: "token",
            message: "you are not authenticated to join a game engine.",
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
                "unable to join a game engine because you are not authenticated.",
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

        const _engine = await prisma.engine.update({
          where: { id: engine.id },
          data: {
            gamers: { connect: { id: gamer.id } },
          },
        });
        const engines = await prisma.engine.findMany({});
        ee.emit(Events.ON_ENGINE_STATE_CHANGE, _engine);
        ee.emit(Events.ON_ENGINES_STATE_CHANGE, engines);
        return {
          engine,
        };
      } catch (error) {
        return {
          error: {
            field: "server",
            message:
              "something went wrong on the server, would you mind try again the action",
          },
        };
      }
    }),
  createEngine: publicProcedure
    .input(createEngineSchema)
    .mutation(async ({ ctx: { req, prisma }, input: { name } }) => {
      const jwt = req.cookies[__cookieName__];
      if (!!!jwt)
        return {
          error: {
            field: "token",
            message:
              "you are not authenticated to create an new game engine/environment.",
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
                "unable to create a game engine because you are not authenticated.",
            },
          };

        if (name.trim().length < 3)
          return {
            error: {
              field: "name",
              message:
                "game engine/environment name to short. the game engine name must have at least 3 characters.",
            },
          };

        const _engine = await prisma.engine.findFirst({
          where: {
            adminId: gamer.id,
          },
        });

        if (!!_engine)
          return {
            error: {
              field: "engine",
              message: `one gamer can only have one engine, you already have an engine named "${_engine.name}" consider deleting it to create a new one.`,
            },
          };
        const __engine = await prisma.engine.findFirst({
          where: { name: name.trim().toLowerCase() },
        });

        if (!!__engine)
          return {
            error: {
              field: "engine",
              message: `engine names must be unique, it appears that "${__engine.name}" is already taken try another onw.`,
            },
          };
        const engine = await prisma.engine.create({
          data: {
            adminId: gamer.id,
            name: name.trim().toLowerCase(),
            gamers: {
              connect: { id: gamer.id },
            },
          },
          include: {
            messages: { include: { sender: true } },
            gamers: true,
          },
        });

        const engines = await prisma.engine.findMany({});
        ee.emit(Events.ON_ENGINES_STATE_CHANGE, engines);
        return {
          engine,
        };
      } catch (error) {
        return {
          error: {
            field: "server",
            message:
              "something went wrong on the server, would you mind try again the action",
          },
        };
      }
    }),
  engines: publicProcedure.query(async ({ ctx: { prisma } }) => {
    const engines = await prisma.engine.findMany({
      include: { gamers: true },
    });
    return {
      engines,
      total: engines.length,
    };
  }),
  engine: publicProcedure
    .input(engineSchema)
    .query(async ({ ctx: { prisma }, input: { engineId } }) => {
      if (!!!engineId) return { engine: null };
      const engine = await prisma.engine.findFirst({
        where: { id: engineId },
        include: { gamers: true, messages: { include: { sender: true } } },
      });
      return {
        engine,
      };
    }),
  onEnginesStateChanged: publicProcedure.subscription(() => {
    return observable<Array<Engine>>((emit) => {
      const handleEvent = async (engines: Engine[]) => {
        emit.next(engines);
      };
      ee.on(Events.ON_ENGINES_STATE_CHANGE, handleEvent);

      return () => {
        ee.off(Events.ON_ENGINES_STATE_CHANGE, handleEvent);
      };
    });
  }),
  onEngineStateChanged: publicProcedure
    .input(onEngineStateChangedSchema)
    .subscription(({ input: { engineId } }) => {
      return observable<Engine>((emit) => {
        const handleEvent = async (engine: Engine) => {
          if (engineId === engine.id) {
            emit.next(engine);
          }
        };
        ee.on(Events.ON_ENGINE_STATE_CHANGE, handleEvent);
        return () => {
          ee.off(Events.ON_ENGINE_STATE_CHANGE, handleEvent);
        };
      });
    }),
});
