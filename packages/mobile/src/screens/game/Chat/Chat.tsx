import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React from "react";
import { COLORS, FONTS, relativeTimeObject } from "../../../constants";
import { AppNavProps } from "../../../params";
import { CustomTextInput, DotCircular } from "../../../components";
import { useHeaderHeight } from "@react-navigation/elements";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { Engine, Gamer, Message } from "@blackjack/server";
import { useMediaQuery } from "../../../hooks";
import { useKeyboardDimension } from "../../../hooks/useKeyBoardDimension";
import { styles } from "../../../styles";
import { trpc } from "../../../utils/trpc";
import { useGamerStore } from "../../../store";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Chat: React.FunctionComponent<AppNavProps<"Chat">> = ({
  navigation,
  route: {
    params: { engineId },
  },
}) => {
  const {
    dimension: { height },
  } = useMediaQuery();
  const { keyboardHeight } = useKeyboardDimension();
  const headerHeight = useHeaderHeight();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        height: 100,
        backgroundColor: COLORS.primary,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: "transparent",
        elevation: 0,
      },
      headerTitleStyle: {
        fontFamily: FONTS.extraBold,
        fontSize: 25,
        color: COLORS.white,
      },
      headerLeft: () => null,
    });
  }, [navigation]);
  const [message, setMessage] = React.useState<string>("");

  const scrollRef = React.useRef<React.LegacyRef<ScrollView> | any>();

  const {
    isLoading,
    data: messages,
    refetch,
  } = trpc.message.messages.useQuery({
    engineId,
  });
  trpc.message.onNewMessage.useSubscription(
    { engineId },
    {
      onData: async (data) => {
        await refetch();
      },
    }
  );
  const { isLoading: sending, mutateAsync } =
    trpc.message.sendMessage.useMutation();
  const sendMessage = () => {
    if (!!!message) return;
    mutateAsync({ engineId, message }).then(({ msg }) => {
      if (!!msg) {
        setMessage("");
        Keyboard.dismiss();
      }
    });
  };

  return (
    <View
      style={{
        height: height - keyboardHeight - headerHeight,
      }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 10 }}
        style={{ flex: 1, backgroundColor: COLORS.tertiary }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        onContentSizeChange={() => {
          scrollRef.current.scrollToEnd({ animated: true });
        }}
      >
        {messages?.messages.length === 0 ? (
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 16,
              padding: 10,
              paddingVertical: 20,
              textAlign: "center",
            }}
          >
            no messages
          </Text>
        ) : null}
        {isLoading ? (
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 16,
              padding: 10,
              paddingVertical: 20,
              textAlign: "center",
            }}
          >
            loading....
          </Text>
        ) : null}
        {messages?.messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
      </ScrollView>
      <SafeAreaView style={{ backgroundColor: COLORS.main }}>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            backgroundColor: COLORS.main,
          }}
        >
          <CustomTextInput
            placeholder="type message..."
            text={message}
            multiline={true}
            inputStyle={{ flex: 1 }}
            onChangeText={(text) => setMessage(text)}
            onSubmitEditing={sendMessage}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={sendMessage}
            disabled={sending}
            style={[
              styles.button,
              {
                backgroundColor: COLORS.secondary,
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
                { color: COLORS.white, marginRight: sending ? 5 : 0 },
              ]}
            >
              Send
            </Text>
            {sending && <DotCircular color={COLORS.main} size={10} />}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Chat;

const MessageComponent: React.FunctionComponent<{
  message: Message & {
    sender: Gamer;
  };
}> = ({ message }) => {
  const { gamer } = useGamerStore((s) => s);
  return (
    <View
      style={{
        alignSelf: gamer?.id !== message.senderId ? "flex-start" : "flex-end",
        maxWidth: "90%",
        marginBottom: 2,
      }}
    >
      <Text
        style={{
          backgroundColor:
            gamer?.id !== message.senderId ? COLORS.main : COLORS.secondary,
          fontFamily: FONTS.regular,
          fontSize: 16,
          color: "white",
          paddingHorizontal: 5,
        }}
      >
        {message.message}
      </Text>
      <Text style={{ fontFamily: FONTS.regular, fontSize: 14, color: "gray" }}>
        {dayjs(message.createdAt).fromNow()} •{" "}
        {gamer?.id === message.senderId ? "you" : message.sender.nickname}
      </Text>
    </View>
  );
};
