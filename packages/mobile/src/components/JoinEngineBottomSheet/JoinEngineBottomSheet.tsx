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
import { useCurrentEngineStore, useGamerStore } from "../../store";
import { trpc } from "../../utils/trpc";
import Oponent from "../Oponent/Oponent";
import Message from "../Message/Message";
import DotCircular from "../DotCircular/DotCircular";
import Loading from "../Loading/Loading";
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
  const { data: gamers, isLoading: fetching } = trpc.game.gamers.useQuery({
    ids: engine.gamersIds.filter((id) => id !== gamer?.id),
  });
  const {
    data: deleteEngineData,
    mutateAsync: mutateDeleteEngine,
    isLoading: deleting,
  } = trpc.engine.deleteEngine.useMutation();
  const { data, mutateAsync, isLoading } = trpc.engine.joinEngine.useMutation();

  const { setEngine, engine: currentEngine } = useCurrentEngineStore((s) => s);
  const joinEngine = () => {
    mutateAsync({ engineId: engine.id }).then(({ engine }) => {
      if (!!engine) {
        setEngine(engine);
        toggle();
        navigation.navigate("Engine", {
          engineId: engine.id,
        });
      }
    });
  };
  const deleteEngine = () => {
    mutateDeleteEngine({ engineId: engine.id }).then(({ engine }) => {
      if (!!engine) {
        toggle();
      }
    });
  };

  return (
    <BottomSheet
      visible={!!engine}
      onBackButtonPress={toggle}
      onBackdropPress={toggle}
    >
      <SafeAreaView
        style={{
          backgroundColor: COLORS.secondary,
          height: height / 2,
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
          {!!currentEngine && currentEngine.id !== engine.id ? (
            <Message
              error={false}
              message={`Remember that you haven't left the game engine "${currentEngine.name}".`}
            />
          ) : null}
        </View>
        <Text
          style={[
            styles.p,
            { color: COLORS.white, margin: 10, fontFamily: FONTS.semiBold },
          ]}
        >
          {engine.gamersIds.filter((id) => id !== gamer?.id).length} opponents
          in the engine.
        </Text>
        {gamers?.gamers ? (
          <FlatList
            style={{ flex: 1, height: 100 }}
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
        ) : null}
        {fetching ? <Loading loadedFont={true} /> : null}
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
              <Text
                style={[
                  styles.button__text,
                  { color: "black", marginRight: deleting ? 5 : 0 },
                ]}
              >
                Delete Engine
              </Text>
              {deleting && <DotCircular color={COLORS.secondary} size={10} />}
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
            <Text
              style={[
                styles.button__text,
                { color: COLORS.white, marginRight: isLoading ? 5 : 0 },
              ]}
            >
              Join
            </Text>
            {isLoading && <DotCircular color={COLORS.secondary} size={10} />}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BottomSheet>
  );
};

export default JoinEngineBottomSheet;
