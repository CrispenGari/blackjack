import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import { trpc } from "../utils/trpc";
import superjson from "superjson";
import { AppRouter } from "@blackjack/server";
interface Props {
  children: React.ReactNode;
}
const getEndingLink = () => {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `http://localhost:3001/api/trpc`,
      headers: async () => {
        const token = "";
        return token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};
      },
    });
  }
  const client = createWSClient({
    url: "ws://localhost:3001/api/trpc",
  });
  return splitLink({
    condition: (op) => op.type === "subscription",
    true: wsLink<AppRouter>({ client }),
    false: httpBatchLink({
      url: `http://localhost:3001/api/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      headers: async () => {
        const token = "";
        return token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};
      },
    }),
  });
};
const TRPCProvider: React.FC<Props> = ({ children }) => {
  const links = [loggerLink(), getEndingLink()];
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links,
      transformer: superjson,
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default TRPCProvider;
