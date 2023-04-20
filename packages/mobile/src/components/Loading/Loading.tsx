import { View, Text, StatusBar, Image } from "react-native";
import React from "react";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONTS } from "../../constants";
interface Props {
  loadedFont: boolean;
  bg?: string;
}
const Loading: React.FunctionComponent<Props> = ({ loadedFont, bg }) => {
  return (
    <LinearGradient
      colors={bg ? [bg, bg] : [COLORS.main, COLORS.secondary]}
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
      <StatusBar barStyle={"light-content"} />
      <Animatable.Image
        animation={"zoomIn"}
        duration={2000}
        iterationCount={"infinite"}
        easing={"linear"}
        direction={"normal"}
        useNativeDriver={false}
        source={{
          uri: Image.resolveAssetSource(require("../../../assets/logo.png"))
            .uri,
        }}
        style={{
          width: 100,
          height: 100,
          marginBottom: 50,
          resizeMode: "contain",
        }}
      />

      {loadedFont ? (
        <Text
          style={{ color: "white", fontSize: 18, fontFamily: FONTS.semiBold }}
        >
          loading...
        </Text>
      ) : (
        <Text style={{ color: "white", fontSize: 18 }}>loading...</Text>
      )}
    </LinearGradient>
  );
};

export default Loading;
