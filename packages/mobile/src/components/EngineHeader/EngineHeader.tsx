import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../../constants";
import { styles } from "../../styles";
import { Engine } from "@blackjack/server";
import { trpc } from "../../utils/trpc";
import DotCircular from "../DotCircular/DotCircular";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppParamList } from "../../params";

interface Props {
  engine: Engine;
  navigation: StackNavigationProp<AppParamList, "Engine">;
}
const EngineHeader: React.FunctionComponent<Props> = ({
  engine,
  navigation,
}) => {
  const { mutateAsync: mutateLeaveEngine, isLoading: leaving } =
    trpc.engine.leaveEngine.useMutation();
  const leaveEngine = () => {
    mutateLeaveEngine({ engineId: engine.id }).then(({ engine, error }) => {
      if (!!engine) {
        navigation.replace("Engines");
      }
      if (!!error) {
        Alert.alert(
          "blackjack",
          error.message,
          [{ style: "destructive", text: "OK" }],
          { cancelable: false }
        );
      }
    });
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        padding: 10,
        justifyContent: "space-between",
        backgroundColor: COLORS.main,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: FONTS.extraBold,
            color: COLORS.white,
            fontSize: 20,
          }}
        >
          ENGINE: {engine.name.toUpperCase()}
        </Text>
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.regular,
          }}
        >
          You are playing blackjack from engine {engine.name} which contains{" "}
          {engine.gamersIds.length || 0} players and have{" "}
          {engine.gamersIds.length ? engine.gamersIds.length - 1 : 0} opponents.
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.button,
          {
            backgroundColor: COLORS.secondary,
            padding: 5,
            borderRadius: 5,
            marginLeft: 10,
            maxWidth: 80,
          },
        ]}
        onPress={leaveEngine}
      >
        <Text
          style={[
            styles.button__text,
            { color: COLORS.white, marginRight: leaving ? 5 : 0 },
          ]}
        >
          Leave
        </Text>
        {leaving && <DotCircular color={COLORS.main} size={10} />}
      </TouchableOpacity>
    </View>
  );
};

export default EngineHeader;
