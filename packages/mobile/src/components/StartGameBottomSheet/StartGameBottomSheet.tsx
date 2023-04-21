import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import React from "react";
import { BottomSheet } from "react-native-btr";

import { BLACK_JACKS, CARDS_BACK, COLORS, FONTS } from "../../constants";
import { styles } from "../../styles";
import { trpc } from "../../utils/trpc";
import { useMediaQuery } from "../../hooks";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import Message from "../Message/Message";
import DotCircular from "../DotCircular/DotCircular";
import { useEnvironmentStore, useGamerStore } from "../../store";
import { Engine } from "@blackjack/server";
import Oponent from "../Oponent/Oponent";

interface Props {
  toggle: () => void;
  open: boolean;
  engine: Engine;
}
const StartGameBottomSheet: React.FunctionComponent<Props> = ({
  toggle,
  open,
  engine,
}) => {
  const {
    dimension: { height },
  } = useMediaQuery();
  const { mutateAsync, data, isLoading } = trpc.game.startGame.useMutation();
  const [jack, setJack] = React.useState<{
    name: string;
    id: string;
    src: string;
  }>(BLACK_JACKS[0]);
  const [cover, setCover] = React.useState<{
    id: string;
    src: string;
  }>(CARDS_BACK[0]);

  const { environment } = useEnvironmentStore((s) => s);
  const { gamer } = useGamerStore((s) => s);
  const { data: gamers } = trpc.game.gamers.useQuery({
    ids: engine.gamersIds.filter((id) => id !== gamer?.id),
  });
  const startGame = () => {
    mutateAsync({
      engineId: engine.id,
      blackJack: jack.id,
      backCover: cover.id,
    }).then(({ players }) => {
      if (!!players) {
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
                Start New Game - {engine.name}
              </Text>
            </View>

            {!!gamers?.gamers.length && (
              <Text
                style={[
                  styles.p,
                  {
                    fontFamily: FONTS.semiBold,
                    color: COLORS.white,
                    fontSize: 20,
                    marginLeft: 10,
                  },
                ]}
              >
                {gamers?.gamers.length} more gamers
              </Text>
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 10 }}
              style={{ height: 100 }}
            >
              {!!gamers?.gamers
                ? gamers.gamers
                    .filter((player) => player.id !== gamer?.id)
                    .map((player) => (
                      <Oponent
                        key={player.id}
                        player={player}
                        adminId={engine.adminId}
                      />
                    ))
                : null}
            </ScrollView>

            <Text
              style={[
                styles.p,
                {
                  fontFamily: FONTS.semiBold,
                  color: COLORS.white,
                  fontSize: 20,
                  marginLeft: 10,
                },
              ]}
            >
              Select Black Jack
            </Text>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={BLACK_JACKS}
              style={{ height: 150 }}
              contentContainerStyle={{ paddingLeft: 10 }}
              keyExtractor={({ id }) => id}
              renderItem={({ item: { src, id, name } }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setJack({ id, src, name })}
                  style={{
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor:
                      id === jack.id ? COLORS.main : "transparent",
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
                    {name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <Text
              style={[
                styles.p,
                {
                  fontFamily: FONTS.semiBold,
                  color: COLORS.white,
                  fontSize: 20,
                  marginLeft: 10,
                },
              ]}
            >
              Select Card Cover
            </Text>

            <FlatList
              horizontal
              style={{ height: 150 }}
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
                    maxWidth: 100,
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
                onPress={startGame}
                disabled={isLoading}
                style={[
                  styles.button,
                  {
                    backgroundColor: COLORS.main,
                    padding: 5,
                    borderRadius: 5,
                    marginLeft: 10,
                    maxWidth: 200,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.button__text,
                    { color: COLORS.white, marginRight: isLoading ? 5 : 0 },
                  ]}
                >
                  Shuffle and Dish Cards
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

export default StartGameBottomSheet;
