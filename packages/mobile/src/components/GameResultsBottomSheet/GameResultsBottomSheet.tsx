import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { BottomSheet } from "react-native-btr";
import { COLORS, FONTS } from "../../constants";
import { useMediaQuery } from "../../hooks";
import { styles } from "../../styles";
import { Table } from "..";

interface Props {
  open: boolean;
  toggle: () => void;

  positions: Array<{
    nickname: string;
    points: number;
    position: number;
  }>;
}
const GameResultsBottomSheet: React.FunctionComponent<Props> = ({
  open,
  toggle,
  positions,
}) => {
  const {
    dimension: { height },
  } = useMediaQuery();
  return (
    <BottomSheet
      visible={!!open}
      onBackButtonPress={toggle}
      onBackdropPress={toggle}
    >
      <SafeAreaView
        style={{
          backgroundColor: COLORS.secondary,
          height: height - 200,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
        }}
      >
        <View
          style={{
            padding: 20,
            borderBottomColor: COLORS.white,
            borderBottomWidth: 0.5,
          }}
        >
          <Text style={[styles.h1, { color: COLORS.white, fontSize: 25 }]}>
            Game Over
          </Text>
        </View>
        <Table
          tableHead={["nickname", "position", "points"]}
          tableData={positions.map(({ nickname, points, position }) => [
            nickname,
            position,
            points,
          ])}
          title="GAME RESULTS"
        />
        <View
          style={{
            padding: 20,
            borderTopColor: COLORS.white,
            borderTopWidth: 0.5,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.button,
              {
                backgroundColor: COLORS.tertiary,
                padding: 5,
                borderRadius: 5,
                marginLeft: 10,
                marginRight: 10,
                maxWidth: 150,
              },
            ]}
            onPress={toggle}
          >
            <Text style={[styles.button__text, { color: "black" }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BottomSheet>
  );
};

export default GameResultsBottomSheet;
