import React from "react";
import styles from "@/styles/Game.module.css";
import {
  Environment,
  GameResultsModal,
  Header,
  Loading,
  Toast,
} from "@/components";
import { CButton, CImage, CToaster } from "@coreui/react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useEnvironmentStore, useGamerStore } from "@/store";
interface Props {}
const Game: React.FC<Props> = ({}) => {
  const {
    data: player,
    isLoading: fetching,
    isFetched,
  } = trpc.gamer.gamer.useQuery();
  const { mutate: mutateUpdateGamePosition } =
    trpc.game.updateGamePositions.useMutation();
  const router = useRouter();
  const [toast, addToast] = React.useState(0);
  const [openResults, setOpenResults] = React.useState<boolean>(false);
  const toaster = React.useRef();
  const { setEnvironment, setGamersIds, environment } = useEnvironmentStore(
    (state) => state
  );
  const { gamer, setGamer } = useGamerStore((state) => state);
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

  trpc.engine.onDeleteEngine.useSubscription(
    { engineId },
    {
      onData: (data) => {
        if (data.id === engineId) {
          router.replace("/games");
        }
      },
    }
  );

  trpc.game.onUpdateGamePositions.useSubscription(
    {
      engineId,
      gamerId: gamer?.id || "",
    },
    {
      onData: ({ message }) => {
        addToast(
          Toast({
            message,
            notificationTitle: "Game Engine Update",
          }) as any
        );
      },
    }
  );
  trpc.game.onGameOver.useSubscription(
    { engineId },
    {
      onData: (data) => {
        setOpenResults(true);
      },
    }
  );
  console.log({ environment });
  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!environment?.players) {
      const winner = environment.players.find(
        (player) => player.cards.length === 0
      );
      console.log({ winner });
      if (!!winner) {
        (async (env) => {
          await mutateUpdateGamePosition({ env, winner });
        })(environment);
      }
    }
    return () => {
      mounted = false;
    };
  }, [environment, mutateUpdateGamePosition]);

  const leaveEngine = async () => {
    await mutateLeaveEngine({ engineId });
    router.replace("/games");
  };

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && isFetched) {
      setGamer((player?.gamer as any) || null);
    }
    return () => {
      mounted = false;
    };
  }, [isFetched, player, setGamer]);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && isFetched) {
      if (!!!gamer) {
        router.replace("/");
      }
    }
    return () => {
      mounted = false;
    };
  }, [isFetched, router, gamer]);

  if (fetching) return <Loading />;
  return (
    <div className={styles.game}>
      <Header />
      {!!environment?.positions && (
        <GameResultsModal
          setOpen={setOpenResults}
          open={openResults}
          positions={environment.positions}
        />
      )}
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
            <p>🎈</p>
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
