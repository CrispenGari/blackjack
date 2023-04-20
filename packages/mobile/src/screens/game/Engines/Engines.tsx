import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import { COLORS, FONTS } from "../../../constants";
import {
  Engine,
  EngineHeader,
  JoinEngineBottomSheet,
  Loading,
} from "../../../components";
import { trpc } from "../../../utils/trpc";
import { useGamerStore } from "../../../store";
import { styles } from "../../../styles";
import { Engine as EngineType } from "@blackjack/server";

const Engines: React.FunctionComponent<AppNavProps<"Engines">> = ({
  navigation,
}) => {
  const { data, refetch, isLoading } = trpc.engine.engines.useQuery();
  const [engineToOpen, setEngineToOpen] = React.useState<
    EngineType | undefined
  >();
  const [openCreateEngineBottomSheet, setOpenCreateEngineBottomSheet] =
    React.useState<boolean>(false);

  trpc.engine.onEnginesStateChanged.useSubscription(undefined, {
    onData: async (data) => {
      await refetch();
    },
  });
  const { gamer } = useGamerStore((state) => state);
  const toggle = () => setEngineToOpen(undefined);
  const toggleCreateEngineBottomSheet = () =>
    setOpenCreateEngineBottomSheet((state) => !state);

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
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <EngineHeader
        open={openCreateEngineBottomSheet}
        toggle={toggleCreateEngineBottomSheet}
      />
      {isLoading ? (
        <Loading loadedFont={true} bg={COLORS.secondary} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {data?.total === 0 ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <Text style={[styles.p, { padding: 30 }]}>
                No engines/game environment that are available yet. You can go
                ahead and create one.
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleCreateEngineBottomSheet}
                style={[
                  styles.button,
                  {
                    backgroundColor: COLORS.secondary,
                    padding: 5,
                    borderRadius: 5,
                    marginLeft: 10,
                  },
                ]}
              >
                <Text style={[styles.button__text, { color: COLORS.white }]}>
                  Create New Engine/Environment
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {data?.engines.map((engine) => (
                <Engine
                  key={engine.id}
                  engine={engine}
                  onPress={() => setEngineToOpen(engine)}
                />
              ))}
            </View>
          )}
          <View style={{ height: 200 }} />
        </ScrollView>
      )}

      {engineToOpen && (
        <JoinEngineBottomSheet
          navigation={navigation}
          engine={engineToOpen}
          toggle={toggle}
        />
      )}
    </View>
  );
};

export default Engines;
