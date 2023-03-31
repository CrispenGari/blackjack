import React from "react";
import styles from "@/styles/Game.module.css";
import { Environment, Header } from "@/components";
import { CButton, CImage } from "@coreui/react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useEnvironmentStore } from "@/store";
interface Props {}
const Game: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { setEnvironment } = useEnvironmentStore((state) => state);
  const engineId: string = (router.query.id as string) || "";
  const { data, isLoading, refetch } = trpc.engine.engine.useQuery({
    engineId,
  });
  trpc.engine.onEngineStateChanged.useSubscription(
    { engineId },
    {
      onData: async (data) => {
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

  return (
    <div className={styles.game}>
      <Header />
      <div className={styles.game__main}>
        <div className={styles.game__main__header}>
          <div>
            <h1>Engine: {data?.engine?.name}</h1>
            <p>
              You are playing blackjack from engine {data?.engine?.name} which
              contains {data?.engine?.gamersIds.length} players.
            </p>
          </div>
          <CButton>Leave</CButton>
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
