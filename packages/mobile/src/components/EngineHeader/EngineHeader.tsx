import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../../constants";
import { styles } from "../../styles";
import CreateEngineBottomSheet from "../CreateEngineBottomSheet/CreateEngineBottomSheet";

const EngineHeader = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  const toggleCreateEngineBottomSheet = () => setOpen((state) => !state);

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
          GAME ENGINES
        </Text>
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.regular,
          }}
        >
          To play the games, please select the engine you want to join or create
          one.
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
        onPress={toggleCreateEngineBottomSheet}
      >
        <Text style={[styles.button__text, { color: COLORS.white }]}>New</Text>
      </TouchableOpacity>

      <CreateEngineBottomSheet
        toggle={toggleCreateEngineBottomSheet}
        open={open}
      />
    </View>
  );
};

export default EngineHeader;
