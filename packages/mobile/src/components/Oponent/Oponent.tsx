import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Gamer } from "@blackjack/server";
import { useGamerStore } from "../../store";
import { trpc } from "../../utils/trpc";
import { COLORS, FONTS } from "../../constants";
import { styles } from "../../styles";

interface Props {
  player: Gamer;
  adminId?: string;
}
const Oponent: React.FunctionComponent<Props> = ({ player, adminId }) => {
  const { mutate, isLoading } = trpc.game.removeGamer.useMutation();
  const { gamer } = useGamerStore((s) => s);
  const removePlayer = async () => {
    await mutate({ gamerId: player.id });
  };
  return (
    <View
      style={{
        marginRight: 10,
        backgroundColor: COLORS.main,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        maxHeight: 100,
        padding: 10,
        paddingHorizontal: 20,
        width: 120,
      }}
    >
      <Text
        style={[styles.p, { color: COLORS.white, fontFamily: FONTS.semiBold }]}
      >
        {player.nickname}
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.button,
          {
            backgroundColor:
              gamer?.id !== adminId ? COLORS.tertiary : COLORS.secondary,
            padding: 5,
            borderRadius: 5,
            marginTop: 10,
            maxWidth: 100,
          },
        ]}
        disabled={isLoading || gamer?.id !== adminId}
        onPress={removePlayer}
      >
        <Text style={[styles.button__text, { color: COLORS.white }]}>
          remove
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Oponent;
