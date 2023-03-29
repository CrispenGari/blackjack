import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@blackjack/server";

export const trpc = createTRPCReact<AppRouter>();
