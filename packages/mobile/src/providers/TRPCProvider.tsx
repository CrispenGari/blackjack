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
import { TOKEN_KEY, engrokDomain } from "../constants";
import { retrieve } from "../utils";
interface Props {
  children: React.ReactNode;
}
const getEndingLink = () => {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `http://${engrokDomain}/api/trpc`,
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
    url: `ws://${engrokDomain}/api/trpc`,
  });
  return splitLink({
    condition: (op) => op.type === "subscription",
    true: wsLink<AppRouter>({ client }),
    false: httpBatchLink({
      url: `http://${engrokDomain}/api/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      headers: async () => {
        const token = await retrieve(TOKEN_KEY);
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
