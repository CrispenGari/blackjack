import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import { COLORS, FONTS } from "../../../constants";
import { Engine, EngineHeader, Loading } from "../../../components";
import { trpc } from "../../../utils/trpc";
import { useGamerStore } from "../../../store";
import { styles } from "../../../styles";

const Engines: React.FunctionComponent<AppNavProps<"Engines">> = ({
  navigation,
}) => {
  const { data, refetch, isLoading } = trpc.engine.engines.useQuery();

  trpc.engine.onEnginesStateChanged.useSubscription(undefined, {
    onData: async (data) => {
      await refetch();
    },
  });

  const { gamer } = useGamerStore((state) => state);
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
      <EngineHeader />

      {isLoading ? (
        <Loading loadedFont={true} bg={COLORS.secondary} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            padding: 10,
            backgroundColor: COLORS.tertiary,
          }}
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
            data?.engines.map((engine) => (
              <Engine key={engine.id} engine={engine} />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Engines;
