import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { BottomSheet } from "react-native-btr";
import { COLORS, INSTRUCTIONS_KEY } from "../../constants";
import { styles } from "../../styles";
import { useMediaQuery } from "../../hooks";
import { useGamerStore } from "../../store";
import Message from "../Message/Message";
import { store } from "../../utils";

interface Props {
  toggle: () => void;
  open: boolean;
}
const GameHelpBottomSheet: React.FunctionComponent<Props> = ({
  toggle,
  open,
}) => {
  const { gamer } = useGamerStore((s) => s);

  const {
    dimension: { height },
  } = useMediaQuery();

  return (
    <BottomSheet
      visible={!!open}
      onBackButtonPress={toggle}
      onBackdropPress={toggle}
    >
      <SafeAreaView
        style={{
          backgroundColor: COLORS.secondary,
          height: height - 150,
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
            Game Instructions
          </Text>
          <Text style={[styles.p, { color: COLORS.white }]}>
            Please read the game instructions before you start the game.
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1, backgroundColor: COLORS.tertiary }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
        >
          <Message
            error={false}
            message="Everyone has a equal chance to win the game. "
          />

          <Text style={[styles.p]}>
            1. Since it is a multiple player game, every gammer has a number and
            the playing turns moves in ascending order of numbers meaning: _
            player number 1 plays first and the last player will play last.
          </Text>
          <Text style={[styles.p]}>
            2. Note that the maximum number of players allowed to be in a game
            engine or environment are 5 players and minimum for the game to be
            able to start are 2 players.
          </Text>

          <Text style={[styles.p]}>
            3. You match cards that have same name for example a Q and a Q, a 2
            and a 2, it doesn't mater which Q is it. It can be of hearts, clubs,
            spades or diamonds. Here is an example of matching cards.
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 10,
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: Image.resolveAssetSource(
                  require("../../../assets/cards/png/4_of_clubs.png")
                ).uri,
              }}
              style={{ width: 100, height: 100, resizeMode: "contain" }}
            />
            <Image
              source={{
                uri: Image.resolveAssetSource(
                  require("../../../assets/cards/png/4_of_hearts.png")
                ).uri,
              }}
              style={{ width: 100, height: 100, resizeMode: "contain" }}
            />
          </View>

          <Text style={[styles.p, { textAlign: "center", marginBottom: 10 }]}>
            So to match these cards you just need to click the first card and
            click the next one, then your cards will be updated.
          </Text>
          <Text style={[styles.p]}>
            4. In the event that your matching cards are finished you click the
            DONE button so that the next player in ascending will play next.
          </Text>
          <Text style={[styles.p]}>
            5. After all the matching cards has been finished on all the gamers,
            now gamers can start picking up the cards for the next ascending
            player. When you see that you picked thematching card you can match
            and click DONE button so that the next player will also pick from
            whoever he should pick from.
          </Text>
          <Text style={[styles.p]}>
            6. Note that if you pick a card, as an important rule if the card
            match play it and click the DONE button if not just click the DONE
            button so that next players get their chances.
          </Text>
          <Text style={[styles.p]}>
            7. The process will be looped till all the cards are finished. The
            player that will be left with JACK_OF_CLUBS or JACK_OF_SPADES will
            loose the game, here are the jacks that we are talking about.
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 10,
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: Image.resolveAssetSource(
                  require("../../../assets/cards/png/j_of_clubs.png")
                ).uri,
              }}
              style={{ width: 100, height: 100, resizeMode: "contain" }}
            />
            <Image
              source={{
                uri: Image.resolveAssetSource(
                  require("../../../assets/cards/png/j_of_spades.png")
                ).uri,
              }}
              style={{ width: 100, height: 100, resizeMode: "contain" }}
            />
          </View>
        </ScrollView>
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
            onPress={async () => {
              if (!!gamer) {
                await store(INSTRUCTIONS_KEY, gamer.id);
              }
              toggle();
            }}
          >
            <Text style={[styles.button__text, { color: "black" }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BottomSheet>
  );
};

export default GameHelpBottomSheet;
