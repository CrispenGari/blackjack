import { View, Text } from "react-native";
import React from "react";
import { styles } from "../../styles";
import { COLORS } from "../../constants";

interface Props {
  title: string;
}
const Divider: React.FunctionComponent<Props> = ({ title }) => {
  return (
    <View
      style={{
        marginVertical: 10,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={[styles.h1, { color: COLORS.white }]}>{title}</Text>
      <View
        style={{
          borderBottomColor: COLORS.white,
          flex: 1,
          borderBottomWidth: 0.5,
          marginLeft: 10,
        }}
      />
    </View>
  );
};

export default Divider;
