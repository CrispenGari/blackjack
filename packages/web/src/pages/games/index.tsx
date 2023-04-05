import React, { useState } from "react";
import styles from "@/styles/Games.module.css";
import { Header, NewGameModal, Game } from "@/components";
import { useRouter } from "next/router";
import { useGamerStore } from "@/store";
import { CButton, CImage } from "@coreui/react";
import { trpc } from "@/utils/trpc";
interface Props {}
const Games: React.FC<Props> = ({}) => {
  const { data, refetch, isLoading } = trpc.engine.engines.useQuery();
  trpc.engine.onEnginesStateChanged.useSubscription(undefined, {
    onData: async (data) => {
      await refetch();
    },
  });
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const { gamer } = useGamerStore((state) => state);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!!gamer?.loggedIn) {
      router.replace("/auth/login");
    }
    return () => {
      mounted = false;
    };
  }, [router, gamer]);

  return (
    <div className={styles.games}>
      <Header />
      <NewGameModal open={open} setOpen={setOpen} />
      <div className={styles.games__main}>
        <div className={styles.games__main__header}>
          <div>
            <h1>Game Engines</h1>
            <p>
              To play games, please select the game engine you want to join, or
              create one.
            </p>
          </div>
          <CButton onClick={() => setOpen(true)}>New</CButton>
        </div>

        {isLoading ? (
          <div className={styles.games__main__loading}>
            <CImage src="/logo.png" alt="logo" />
            <p>loading...</p>
          </div>
        ) : (
          <div className={styles.games__main__games}>
            {data?.total === 0 ? (
              <div className={styles.games__main__games__no__engine}>
                <p style={{ padding: 30, userSelect: "none" }}>
                  No engines/game environment that are available yet. You can go
                  ahead and create one.
                </p>
                <CButton onClick={() => setOpen(true)}>
                  Create New Engine/Environment
                </CButton>
              </div>
            ) : (
              data?.engines.map((engine) => (
                <Game key={engine.id} engine={engine} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
