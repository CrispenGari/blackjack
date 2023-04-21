import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import { BottomSheet } from "react-native-btr";

import { CARDS_BACK, COLORS, FONTS } from "../../constants";
import { styles } from "../../styles";
import { trpc } from "../../utils/trpc";
import { useMediaQuery } from "../../hooks";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import Message from "../Message/Message";
import DotCircular from "../DotCircular/DotCircular";

interface Props {
  toggle: () => void;
  open: boolean;
}
const CreateEngineBottomSheet: React.FunctionComponent<Props> = ({
  toggle,
  open,
}) => {
  const {
    dimension: { height },
  } = useMediaQuery();
  const { mutateAsync, isLoading, data } =
    trpc.engine.createEngine.useMutation();
  const [{ name }, setForm] = React.useState<{
    name: string;
  }>({ name: "" });
  const [cover, setCover] = React.useState<{
    id: string;
    src: string;
  }>(CARDS_BACK[0]);
  const createEngine = async () => {
    mutateAsync({ name, cover: cover.id }).then(({ engine }) => {
      if (!!engine) {
        setForm({ name: "" });
        toggle();
      }
    });
  };
  return (
    <BottomSheet
      visible={!!open}
      onBackButtonPress={toggle}
      onBackdropPress={toggle}
    >
      <SafeAreaView
        style={{
          backgroundColor: COLORS.secondary,
          height: height - 100,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
        }}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{ flex: 1, zIndex: 1000 }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                padding: 20,
                borderBottomColor: COLORS.white,
                borderBottomWidth: 0.5,
              }}
            >
              <Text style={[styles.h1, { color: COLORS.white, fontSize: 25 }]}>
                New Engine
              </Text>
            </View>

            <View style={{ padding: 10 }}>
              <CustomTextInput
                placeholder="Engine Name"
                inputStyle={{
                  fontSize: 20,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  maxWidth: 500,
                  marginBottom: 5,
                }}
                text={name}
                onChangeText={(text) =>
                  setForm((state) => ({ ...state, name: text }))
                }
                onSubmitEditing={createEngine}
              />
              <Text
                style={[
                  styles.p,
                  {
                    fontFamily: FONTS.semiBold,
                    color: COLORS.white,
                    fontSize: 20,
                  },
                ]}
              >
                Select Card Cover
              </Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={CARDS_BACK}
              contentContainerStyle={{ paddingLeft: 10 }}
              keyExtractor={({ id }) => id}
              renderItem={({ item: { src, id } }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setCover({ id, src })}
                  style={{
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor:
                      id === cover.id ? COLORS.main : "transparent",
                    borderWidth: 1,
                    borderColor: COLORS.main,
                    height: 150,
                    alignItems: "center",
                    marginRight: 5,
                    paddingHorizontal: 0,
                  }}
                >
                  <Image
                    source={{ uri: Image.resolveAssetSource(src).uri }}
                    style={{ width: 100, flex: 1, resizeMode: "contain" }}
                  />
                  <Text style={{ fontFamily: FONTS.semiBold, color: "white" }}>
                    {id}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View
              style={{
                flex: 1,
              }}
            />
            {!!data?.error && (
              <View style={{ padding: 10 }}>
                <Message error message={data.error.message} />
              </View>
            )}
            <View
              style={{
                padding: 20,
                borderTopColor: COLORS.white,
                borderTopWidth: 0.5,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.button,
                  {
                    backgroundColor: COLORS.tertiary,
                    padding: 5,
                    borderRadius: 5,
                    marginLeft: 10,
                    marginRight: 10,
                    maxWidth: 150,
                  },
                ]}
                onPress={toggle}
                disabled={isLoading}
              >
                <Text style={[styles.button__text, { color: "black" }]}>
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={createEngine}
                disabled={isLoading}
                style={[
                  styles.button,
                  {
                    backgroundColor: COLORS.main,
                    padding: 5,
                    borderRadius: 5,
                    marginLeft: 10,
                    maxWidth: 100,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.button__text,
                    { color: COLORS.white, marginRight: isLoading ? 5 : 0 },
                  ]}
                >
                  Create
                </Text>
                {isLoading && (
                  <DotCircular color={COLORS.secondary} size={10} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </BottomSheet>
  );
};

export default CreateEngineBottomSheet;
