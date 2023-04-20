import { Animated, View } from "react-native";
import React from "react";
interface Props {
  size: number;
  color: string;
}
const DotCircular: React.FunctionComponent<Props> = ({ size, color }) => {
  const indicatorAnimation = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(indicatorAnimation, {
        toValue: 1,
        delay: 0,
        duration: 1000,
        useNativeDriver: false,
      })
    ).start();
  }, []);
  const rotate = indicatorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <Animated.View
      style={{
        borderColor: "transparent",
        position: "relative",
        width: size,
        height: size,
        transform: [{ rotate }],
        borderRadius: size,
        borderWidth: 3,
      }}
    >
      <View
        style={{
          position: "absolute",
          width: 8,
          height: 8,
          borderRadius: 8,
          backgroundColor: color,
          top: -4,
        }}
      />
    </Animated.View>
  );
};

export default DotCircular;
