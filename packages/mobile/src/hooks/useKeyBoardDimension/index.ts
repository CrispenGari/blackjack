import React from "react";
import { Keyboard } from "react-native";
export const useKeyboardDimension = () => {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", (_e) =>
      setKeyboardHeight(0)
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return {
    keyboardHeight,
  };
};
