import React, { useState } from "react";
import styles from "@/styles/Games.module.css";
import { Header, NewGameModal, Game, GameHelpModal } from "@/components";
import { useRouter } from "next/router";
import { useGamerStore } from "@/store";
import { CButton, CFormInput, CImage } from "@coreui/react";
import { trpc } from "@/utils/trpc";
import { Engine, Gamer } from "@blackjack/server";
import { INSTRUCTIONS_KEY } from "@/constants";
import { retrieve } from "@/utils";
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
  const [openGameHelp, setOpenGameHelp] = React.useState<boolean>(false);
  const { gamer } = useGamerStore((state) => state);
  const [name, setName] = React.useState<string>("");

  const [engines, setEngines] = React.useState<
    Array<
      Engine & {
        admin: Gamer;
      }
    >
  >(data?.engines || []);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted) {
      if (!!name) {
        setEngines((state) =>
          state.filter((engine) =>
            engine.name.toLowerCase().includes(name.trim().toLowerCase())
          )
        );
      } else {
        setEngines(data?.engines || []);
      }
    }
    return () => {
      mounted = false;
    };
  }, [name, data]);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!!gamer?.loggedIn) {
      router.replace("/auth/login");
    }
    return () => {
      mounted = false;
    };
  }, [router, gamer]);
  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!gamer) {
      (async () => {
        const id = await retrieve(INSTRUCTIONS_KEY);
        if (gamer.id !== id) {
          setOpenGameHelp(true);
        }
      })();
    }
    return () => {
      mounted = false;
    };
  }, [gamer]);

  return (
    <div className={styles.games}>
      <Header />
      <NewGameModal open={open} setOpen={setOpen} />
      <GameHelpModal open={openGameHelp} setOpen={setOpenGameHelp} />
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
        <div className={styles.games__main__search}>
          <CFormInput
            type="text"
            placeholder="filter engines..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            ) : engines.length !== 0 ? (
              engines.map((engine) => <Game key={engine.id} engine={engine} />)
            ) : (
              <p
                style={{
                  padding: 20,
                  userSelect: "none",
                }}
              >
                No engines that matches filter {`"${name}"`}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
