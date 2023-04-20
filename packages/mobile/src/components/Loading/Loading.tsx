import { View, Text, StatusBar } from "react-native";
import React from "react";

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StatusBar barStyle={"light-content"} />
      <Text>Loading...</Text>
    </View>
  );
};

export default Loading;
