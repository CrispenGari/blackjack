import {
  View,
  StyleProp,
  ViewStyle,
  TextInput,
  TouchableOpacity,
  KeyboardTypeOptions,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
  Text,
  TextStyle,
} from "react-native";
import React from "react";
import { FONTS } from "../../constants";

interface Props {
  inputStyle: StyleProp<TextStyle>;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  text: string;
  onChangeText: (text: string) => void;
  secureTextEntry: boolean;
  editable: boolean;
  onSubmitEditing: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  numberOfLines: number;
  multiline: boolean;
}
const CustomTextInput: React.FunctionComponent<Partial<Props>> = ({
  placeholder,
  inputStyle,

  keyboardType,
  text,
  onChangeText,
  editable,
  onSubmitEditing,
  secureTextEntry,
  multiline,
  numberOfLines,
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={"gray"}
      style={[
        {
          backgroundColor: "#f5f5f5",
          marginHorizontal: 10,
          borderRadius: 5,
          fontFamily: FONTS.regular,
          fontSize: 18,
          paddingVertical: 5,
          paddingHorizontal: 10,
        },
        inputStyle,
      ]}
      keyboardType={keyboardType}
      value={text}
      onChangeText={onChangeText}
      editable={editable}
      onSubmitEditing={onSubmitEditing}
      secureTextEntry={secureTextEntry}
      numberOfLines={numberOfLines}
      multiline={multiline}
    />
  );
};

export default CustomTextInput;
