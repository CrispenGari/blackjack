import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { Engine as EngineType, Gamer } from "@blackjack/server";
import { CARDS_BACK, COLORS, relativeTimeObject } from "../../constants";
import { useGamerStore } from "../../store";
import { styles } from "../../styles";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
interface Props {
  engine: EngineType & { admin: Gamer };
  onPress: () => void;
}
const Engine: React.FunctionComponent<Props> = ({ engine, onPress }) => {
  const { gamer } = useGamerStore((s) => s);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 130,
        backgroundColor: COLORS.white,
        margin: 5,
        borderRadius: 5,
      }}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: Image.resolveAssetSource(
            CARDS_BACK.find((c) => c.id === engine.cover)!.src
          ).uri,
        }}
        style={{ height: 70, resizeMode: "contain" }}
      />
      <View
        style={{
          backgroundColor: COLORS.secondary,
          borderRadius: 5,
          padding: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.p, { color: COLORS.white }]}>engine:</Text>
          <Text style={[styles.p, { color: COLORS.white }]}>{engine.name}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.p, { color: COLORS.white }]}>admin:</Text>
          <Text style={[styles.p, { color: COLORS.white }]}>
            {engine.admin.nickname === gamer?.nickname
              ? "you"
              : engine.admin.nickname}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.p, { color: COLORS.white }]}>created:</Text>
          <Text style={[styles.p, { color: COLORS.white }]}>
            {dayjs(engine.createdAt).fromNow()} ago
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Engine;
