import { View, Text } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { AuthNavProps } from "../../../params";

const Landing: React.FunctionComponent<AuthNavProps<"Landing">> = ({
  navigation,
}) => {
  return (
    <LinearGradient
      colors={[COLORS.main, COLORS.secondary]}
      start={{
        x: 0,
        y: 1,
      }}
      end={{
        x: 0,
        y: 0,
      }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text
        style={{
          fontSize: 30,
          fontFamily: FONTS.italic,
        }}
      >
        Landing
      </Text>
    </LinearGradient>
  );
};

export default Landing;
