import { View, Text, ScrollView } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import { COLORS, FONTS } from "../../../constants";
import { EngineHeader, Loading } from "../../../components";
import { trpc } from "../../../utils/trpc";

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
  const { data, isLoading, refetch } = trpc.engine.engine.useQuery({
    engineId,
  });

  return (
    <View style={{ flex: 1 }}>
      {!!data?.engine && (
        <EngineHeader engine={data.engine} navigation={navigation} />
      )}
      {isLoading ? (
        <Loading loadedFont={true} bg={COLORS.secondary} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        ></ScrollView>
      )}
    </View>
  );
};

export default Engine;
