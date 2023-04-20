import { View, Text } from "react-native";
import React from "react";
import { COLORS } from "../../constants";
import { styles } from "../../styles";

interface Props {
  error: boolean;
  message: string;
}
const Message: React.FunctionComponent<Props> = ({ error, message }) => {
  return (
    <View
      style={{
        backgroundColor: !error ? COLORS.main : COLORS.red,
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
