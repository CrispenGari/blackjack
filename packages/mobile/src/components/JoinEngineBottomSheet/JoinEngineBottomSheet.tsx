import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import { Engine } from "@blackjack/server";
import { BottomSheet } from "react-native-btr";
import { COLORS, FONTS } from "../../constants";
import { styles } from "../../styles";
import { useMediaQuery } from "../../hooks";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppParamList } from "../../params";
import { useGamerStore } from "../../store";
import { trpc } from "../../utils/trpc";
import Oponent from "../Oponent/Oponent";
import Message from "../Message/Message";
interface Props {
  engine: Engine;
  toggle: () => void;
  navigation: StackNavigationProp<AppParamList, "Engines">;
}
const JoinEngineBottomSheet: React.FunctionComponent<Props> = ({
  engine,
  toggle,
  navigation,
}) => {
  const {
    dimension: { height },
  } = useMediaQuery();
  const { gamer } = useGamerStore((s) => s);
  const { data: gamers } = trpc.game.gamers.useQuery({
    ids: engine.gamersIds.filter((id) => id !== gamer?.id),
  });
  const {
    data: deleteEngineData,
    mutate: mutateDeleteEngine,
    isLoading: deleting,
  } = trpc.engine.deleteEngine.useMutation();
  const { data, mutate, isLoading } = trpc.engine.joinEngine.useMutation();

  const joinEngine = async () => {
    await mutate({ engineId: engine.id });
  };
  const deleteEngine = async () => {
    await mutateDeleteEngine({ engineId: engine.id });
  };

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!data?.engine) {
      navigation.navigate("Engine", {
        engineId: data.engine.id,
      });
    }
    return () => {
      mounted = false;
    };
  }, [data, navigation]);
  return (
    <BottomSheet
      visible={!!engine}
      onBackButtonPress={toggle}
      onBackdropPress={toggle}
    >
      <SafeAreaView
        style={{
          backgroundColor: COLORS.secondary,
          height: height / 2 - 40,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
        }}
      >
        <View
          style={{
            padding: 20,
            borderBottomColor: COLORS.white,
            borderBottomWidth: 0.5,
          }}
        >
          <Text style={[styles.h1, { color: COLORS.white, fontSize: 25 }]}>
            Join Game Environment - {engine.name}
          </Text>
        </View>
        <Text
          style={[
            styles.p,
            { color: COLORS.white, margin: 10, fontFamily: FONTS.semiBold },
          ]}
        >
          {engine.gamersIds.length} opponents in the engine.
        </Text>
        {gamers?.gamers && (
          <FlatList
            style={{ flex: 1 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={gamers.gamers}
            keyExtractor={({ id }) => id}
            contentContainerStyle={{ paddingLeft: 10 }}
            renderItem={({ item: player }) => (
              <Oponent player={player} adminId={engine.adminId} />
            )}
          />
        )}
        {!!data?.error && (
          <View style={{ padding: 10 }}>
            <Message error message={data.error.message} />
          </View>
        )}
        {!!deleteEngineData?.error && (
          <View style={{ padding: 10 }}>
            <Message error message={deleteEngineData.error.message} />
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
          {gamer?.id === engine.adminId && (
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
              onPress={deleteEngine}
              disabled={isLoading || deleting}
            >
              <Text style={[styles.button__text, { color: "black" }]}>
                Delete Engine
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={joinEngine}
            disabled={isLoading || deleting}
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
            <Text style={[styles.button__text, { color: COLORS.white }]}>
              Join
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BottomSheet>
  );
};

export default JoinEngineBottomSheet;
