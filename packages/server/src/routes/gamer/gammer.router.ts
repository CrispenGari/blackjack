import {
  loginSchema,
  onAuthStateChangeSchema,
  registerSchema,
} from "../../schema/gamer/gamer.schema";
import { publicProcedure, router } from "../../trpc";
import { serialize } from "cookie";
import bcrypt from "bcryptjs";
import { signJwt, verifyJwt } from "../../utils";
import { Events, __cookieMaxAge__, __cookieName__ } from "../../constants";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { Gamer } from "@prisma/client";

const ee = new EventEmitter({
  captureRejections: true,
});
export const gamerRouter = router({
  onAuthStateChange: publicProcedure
    .input(onAuthStateChangeSchema)
    .subscription(({ input: { gamerId } }) => {
      return observable<{ gamer: Gamer } | null>((emit) => {
        const handleEvent = async (gamer: Gamer) => {
          if (!!gamer) {
            if (gamer.id === gamerId) {
              emit.next({ gamer: gamer });
            }
          }
        };
        ee.on(Events.ON_AUTH_STATE_CHANGED, handleEvent);
        return () => {
          ee.off(Events.ON_AUTH_STATE_CHANGED, handleEvent);
        };
      });
    }),
  gamer: publicProcedure.query(async ({ ctx: { prisma, req } }) => {
    const jwt = req.cookies[__cookieName__];
    if (!!!jwt) return { gamer: null };
    try {
      const payload = await verifyJwt(jwt);
      const gamer = await prisma.gamer.findFirst({
        where: { id: payload.id },
      });
      return {
        gamer: {
          ...gamer,
          password: "<hidden>",
        },
      };
    } catch (error) {
      console.log({ error });
      return { gamer: null };
    }
  }),
  login: publicProcedure
    .input(loginSchema)
    .mutation(
      async ({ input: { nickname, password, web }, ctx: { prisma, res } }) => {
        const gamer = await prisma.gamer.findFirst({
          where: {
            nickname: nickname.trim().toLowerCase(),
          },
        });

        if (!!!gamer)
          return {
            error: {
              field: "gamer",
              message: "the nickname does not have an account with blackjack.",
            },
          };
        const valid = await bcrypt.compare(password.trim(), gamer.password);
        if (!valid)
          return {
            error: { field: "password", message: "invalid account password." },
          };
        const token = await signJwt(gamer);
        await prisma.gamer.update({
          where: { id: gamer.id },
          data: { loggedIn: true },
        });
        if (web) {
          res.header(
            "Set-Cookie",
            serialize(__cookieName__, token, {
              maxAge: __cookieMaxAge__,
              httpOnly: true,
              secure: false,
              sameSite: "lax",
            })
          );
        }
        return {
          gamer,
          jwt: web ? "" : token,
        };
      }
    ),
  register: publicProcedure
    .input(registerSchema)
    .mutation(
      async ({
        ctx: { prisma, res },
        input: { web, confirmPassword, nickname, password },
      }) => {
        const gamer = await prisma.gamer.findFirst({
          where: {
            nickname: nickname.trim().toLowerCase(),
          },
        });

        if (!!gamer)
          return {
            error: {
              field: "nickname",
              message: "the nickname is already taken by someone else.",
            },
          };

        if (password.trim().length < 5)
          return {
            error: {
              field: "password",
              message: "password must be at least 5 characters long.",
            },
          };

        if (password.trim() !== confirmPassword.trim())
          return {
            error: {
              field: "password",
              message: "the two password must match.",
            },
          };

        if (nickname.trim().length < 3)
          return {
            error: {
              field: "nickname",
              message: "the nickname must contain at least 3 characters.",
            },
          };

        const hash = await bcrypt.hash(password.trim(), 12);

        const _gamer = await prisma.gamer.create({
          data: {
            password: hash,
            nickname: nickname.trim().toLowerCase(),
            loggedIn: true,
          },
        });
        const token = await signJwt(_gamer);
        if (web) {
          res.header(
            "Set-Cookie",
            serialize(__cookieName__, token, {
              maxAge: __cookieMaxAge__,
              httpOnly: true,
              secure: false,
              sameSite: "lax",
            })
          );
        }
        return {
          gamer: _gamer,
          jwt: web ? "" : token,
        };
      }
    ),
  logout: publicProcedure.mutation(async ({ ctx: { req, res, prisma } }) => {
    const jwt = req.cookies[__cookieName__];
    if (!!!jwt) return false;
    try {
      const payload = await verifyJwt(jwt);
      await prisma.gamer.update({
        where: { id: payload.id },
        data: {
          loggedIn: false,
        },
      });
      res.clearCookie(__cookieName__, {
        path: "/api/trpc",
        domain: "localhost",
      });
      return true;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }),
});
