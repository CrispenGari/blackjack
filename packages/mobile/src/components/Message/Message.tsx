import { View, Text } from "react-native";
import React from "react";
import { COLORS } from "../../constants";
import { styles } from "../../styles";

interface Props {
  error: boolean;
  message: string;
  type?: "primary" | "secondary";
}
const Message: React.FunctionComponent<Props> = ({ error, message, type }) => {
  return (
    <View
      style={{
        backgroundColor: error
          ? COLORS.red
          : type === "primary"
          ? COLORS.primary
          : type === COLORS.secondary
          ? COLORS.secondary
          : COLORS.main,
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: "100%",
      }}
    >
      <Text style={[styles.p, { color: "white" }]}>{message}</Text>
    </View>
  );
};

export default Message;
