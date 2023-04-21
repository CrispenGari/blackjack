import { View, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import { COLORS, FONTS } from "../../../constants";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  EngineHeader,
  Environment,
  GameResultsBottomSheet,
  Loading,
} from "../../../components";
import { trpc } from "../../../utils/trpc";
import { useEnvironmentStore, useGamerStore } from "../../../store";
import Toast from "react-native-toast-message";

const Engine: React.FunctionComponent<AppNavProps<"Engine">> = ({
  navigation,
  route: {
    params: { engineId },
  },
}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        height: 100,
        backgroundColor: COLORS.primary,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: "transparent",
        elevation: 0,
      },
      headerTitleStyle: {
        fontFamily: FONTS.extraBold,
        fontSize: 25,
        color: COLORS.white,
      },
      headerLeft: () => null,
    });
  }, [navigation]);

  const {
    data: player,
    isLoading: fetching,
    isFetched,
  } = trpc.gamer.gamer.useQuery();
  const { mutate: mutateUpdateGamePosition } =
    trpc.game.updateGamePositions.useMutation();
  const [openResults, setOpenResults] = React.useState<boolean>(false);
  const toggle = () => setOpenResults((state) => !state);
  const { setEnvironment, setGamersIds, environment } = useEnvironmentStore(
    (state) => state
  );

  const { gamer, setGamer } = useGamerStore((state) => state);
  const { data, isLoading, refetch } = trpc.engine.engine.useQuery({
    engineId,
  });

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
        Toast.show({
          type: "success",
          text1: "New Gamer Joined",
          text2: `${gamer.gamer.nickname} just joined the game engine as ${
            gamer.gamer.id === data?.engine?.adminId
              ? "an admin"
              : " a regular gamer"
          }`,
        });
      },
    }
  );
  trpc.engine.onGamerLeaveEngine.useSubscription(
    { engineId },
    {
      onData: async (g) => {
        Toast.show({
          type: "success",
          text1: "New Gamer Left",
          text2: `${
            g.gamer.nickname === gamer?.nickname ? "you" : g.gamer.nickname
          } just left the game engine as ${
            g.gamer.id === data?.engine?.adminId
              ? "an admin"
              : " a regular gamer"
          }.`,
        });
      },
    }
  );
  trpc.game.onGameStart.useSubscription(
    { gamerId: gamer?.id || "", engineId },
    {
      onData: async ({ message }) => {
        Toast.show({
          type: "success",
          text1: "Game Started",
          text2: message,
        });
      },
    }
  );
  trpc.engine.onDeleteEngine.useSubscription(
    { engineId },
    {
      onData: (data) => {
        if (data.id === engineId) {
          navigation.replace("Engines");
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
        Toast.show({
          type: "success",
          text1: "Game Engine Update",
          text2: message,
        });
      },
    }
  );
  trpc.game.onGamerRemoved.useSubscription(
    {
      engineId,
      gamerId: gamer?.id || "",
    },
    {
      onData: async ({ gamer: me, message }) => {
        Toast.show({
          type: "success",
          text1: "Gamer Removed",
          text2: message,
        });

        await refetch();
        if (me.id === gamer?.id) {
          navigation.replace("Engines");
        }
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
  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!environment?.players) {
      const winner = environment.players.find(
        (player) => player.cards.length === 0
      );
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

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && isFetched) {
      setGamer((player?.gamer as any) || null);
    }
    return () => {
      mounted = false;
    };
  }, [isFetched, player, setGamer]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!!data?.engine ? (
        <EngineHeader engine={data.engine} navigation={navigation} />
      ) : null}
      {isLoading ? (
        <Loading loadedFont={true} bg={COLORS.secondary} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {!!data?.engine ? <Environment engine={data.engine} /> : null}
        </ScrollView>
      )}

      {!!environment?.positions ? (
        <GameResultsBottomSheet
          open={openResults}
          toggle={toggle}
          positions={environment.positions}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default Engine;
