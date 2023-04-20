import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { Engine as EngineType, Gamer } from "@blackjack/server";
import { CARDS_BACK, relativeTimeObject } from "../../constants";
import { useGamerStore } from "../../store";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
interface Props {
  engine: EngineType & { admin: Gamer };
}
const Engine: React.FunctionComponent<Props> = ({ engine }) => {
  const { gamer } = useGamerStore((s) => s);
  return (
    <TouchableOpacity style={{ width: 130, height: 100 }} activeOpacity={0.7}>
      <Image
        source={{
          uri: Image.resolveAssetSource(
            CARDS_BACK.find((c) => c.id === engine.cover)!.src
          ).uri,
        }}
        style={{ height: 100, resizeMode: "contain" }}
      />
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>engine name:</Text>
          <Text>{engine.name}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>admin:</Text>
          <Text>
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
          <Text>created:</Text>
          <Text>{dayjs(engine.createdAt).fromNow()} ago</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Engine;
