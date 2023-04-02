import React from "react";
import styles from "@/styles/Game.module.css";
import { Environment, Header, Toast } from "@/components";
import { CButton, CImage, CToaster } from "@coreui/react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useEnvironmentStore, useGamerStore } from "@/store";
interface Props {}
const Game: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [toast, addToast] = React.useState(0);
  const toaster = React.useRef();
  const { setEnvironment, setGamersIds } = useEnvironmentStore(
    (state) => state
  );
  const { gamer } = useGamerStore((state) => state);

  const engineId: string = (router.query.id as string) || "";
  const { data, isLoading, refetch } = trpc.engine.engine.useQuery({
    engineId,
  });
  const { mutate: mutateLeaveEngine, isLoading: leaving } =
    trpc.engine.leaveEngine.useMutation();

  trpc.engine.onEngineStateChanged.useSubscription(
    { engineId },
    {
      onData: async (data) => {
        setGamersIds(data.gamersIds);
        await refetch();
      },
    }
  );
  trpc.game.onGameStateChanged.useSubscription(
    { engineId: engineId },
    {
      onData: (data) => {
        setEnvironment(data.gameData);
      },
    }
  );
  trpc.engine.onGamerJoinEngine.useSubscription(
    { engineId },
    {
      onData: async (gamer) => {
        addToast(
          Toast({
            message: `${gamer.gamer.nickname} just joined the game engine as ${
              gamer.gamer.id === data?.engine?.adminId
                ? "an admin"
                : " a regular gamer"
            }.`,
            notificationTitle: "New Gamer Joined",
          }) as any
        );
      },
    }
  );
  trpc.engine.onGamerLeaveEngine.useSubscription(
    { engineId },
    {
      onData: async (gamer) => {
        addToast(
          Toast({
            message: `${gamer.gamer.nickname} just left the game engine as ${
              gamer.gamer.id === data?.engine?.adminId
                ? "an admin"
                : " a regular gamer"
            }.`,
            notificationTitle: "New Gamer Left",
          }) as any
        );
      },
    }
  );
  trpc.game.onGameStart.useSubscription(
    { gamerId: gamer?.id || "", engineId },
    {
      onData: async ({ message }) => {
        addToast(
          Toast({
            message,
            notificationTitle: "Game started",
          }) as any
        );
      },
    }
  );

  const leaveEngine = async () => {
    await mutateLeaveEngine({ engineId });
    router.replace("/games");
  };

  return (
    <div className={styles.game}>
      <Header />

      <CToaster ref={toaster as any} push={toast as any} placement="top-end" />
      <div className={styles.game__main}>
        <div className={styles.game__main__header}>
          <div>
            <h1>Engine: {data?.engine?.name}</h1>
            <p>
              You are playing blackjack from engine {data?.engine?.name} which
              contains {data?.engine?.gamersIds.length || 0} players and have{" "}
              {data?.engine?.gamersIds.length
                ? data?.engine?.gamersIds.length - 1
                : 0}{" "}
              opponents.
            </p>
          </div>
          <CButton onClick={leaveEngine} disabled={leaving}>
            Leave
          </CButton>
        </div>
        {isLoading ||
          (!!!data?.engine && (
            <div className={styles.game__main__loading}>
              <CImage src="/logo.png" alt="logo" />
              {isLoading && <p>loading...</p>}
              {!!!data?.engine && <p>no engine data</p>}
            </div>
          ))}
        {data?.engine && <Environment engine={data.engine} />}
      </div>
    </div>
  );
};

export default Game;
