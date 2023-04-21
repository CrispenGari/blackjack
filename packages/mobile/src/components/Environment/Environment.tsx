import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  Engine,
  Message as MessageType,
  Gamer,
  CardType,
} from "@blackjack/server";
import { useGamerStore, useEnvironmentStore } from "../../store";
import { trpc } from "../../utils/trpc";
import { CARDS, CARDS_BACK, COLORS, FONTS } from "../../constants";
import { styles } from "../../styles";
import { useMediaQuery } from "../../hooks";
import Message from "../Message/Message";
import Player from "../Player/Player";
import Card from "../Card/Card";

interface Props {
  engine: Engine & {
    messages: (MessageType & {
      sender: Gamer;
    })[];
  };
}
const Environment: React.FunctionComponent<Props> = ({ engine }) => {
  const { gamer } = useGamerStore((state) => state);
  const { mutate: mutateMatchCards } = trpc.game.matchCards.useMutation();
  const { isLoading, mutate } = trpc.game.updateNextPlayer.useMutation();
  const [pair, setPair] = React.useState<CardType[]>([]);
  const { environment } = useEnvironmentStore((state) => state);
  const [open, setOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [played, setPlayed] = React.useState<CardType[]>([]);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!pair.length) {
      if (pair.length == 2) {
        const values = pair.map((c) => c.value);
        const matched = values.every((v) => v === values[0]);
        if (matched) {
          setPlayed(pair);
        }
        setPair([]);
      }
    }
    return () => {
      mounted = false;
    };
  }, [pair]);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!environment && !!gamer && !!played.length) {
      (async () => {
        const me = environment.players.find((player) => player.id === gamer.id);
        if (!!!me) return;
        const payload = {
          env: environment,
          cards: played,
          gamerId: me.id,
          next: me,
          last: me,
        };

        if (!!me) {
          await mutateMatchCards({
            ...payload,
          });
        }

        await setPlayed([]);
      })();
    }
    return () => {
      mounted = false;
    };
  }, [environment, gamer, mutateMatchCards, played]);

  React.useEffect(() => {
    if (!!error) {
      const timeoutId = setTimeout(() => {
        setError("");
      }, 5000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [error]);
  const opponents = environment?.players.filter(
    (player) => player.id !== gamer?.id
  );
  const playNext = async () => {
    if (!!!gamer || !!!environment) return;
    const players = environment.players;
    const total = players.length;
    const me = players.find((p) => p.id === gamer.id);
    if (!!!me) return;
    const index: number = me?.playerNumber === total ? 1 : me.playerNumber + 1;
    const nextPlayer = players[index - 1];
    await mutate({
      env: environment,
      last: me,
      next: nextPlayer,
    });
  };

  const {
    dimension: { height },
  } = useMediaQuery();

  const toggle = () => setOpen((state) => !state);

  return (
    <View style={{ height: height - 200 }}>
      <View
        style={{
          flex: 0.6,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flex: 2,
            padding: 5,
          }}
        >
          {opponents?.length && opponents.length >= 1 && (
            <Player setError={setError} player={opponents[0]} />
          )}
          {opponents?.length && opponents.length >= 3 && (
            <Player setError={setError} player={opponents[2]} />
          )}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {engine.adminId === gamer?.id ? (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.button,
                {
                  backgroundColor: COLORS.secondary,
                  padding: 5,
                  borderRadius: 5,
                  maxWidth: 80,
                },
              ]}
              onPress={toggle}
            >
              <Text style={[styles.button__text, { color: COLORS.white }]}>
                Start
              </Text>
            </TouchableOpacity>
          ) : engine.playing ? (
            <Text
              style={{
                fontFamily: FONTS.regular,
                color: COLORS.main,
                textAlign: "center",
              }}
            >
              the game has started
            </Text>
          ) : (
            <Text
              style={{
                fontFamily: FONTS.regular,
                color: COLORS.main,
                textAlign: "center",
              }}
            >
              only the admin of the environment can start the game.
            </Text>
          )}
          <View style={{}}>
            {!!!environment?.played.length ? (
              <View
                style={{
                  paddingVertical: 60,
                  position: "relative",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{
                    uri: Image.resolveAssetSource(
                      CARDS_BACK.find((c) => c.id === environment?.backCover)
                        ?.src || CARDS_BACK.find((c) => c.id === "black")!.src
                    ).uri,
                  }}
                  style={[
                    _styles.card__image,
                    {
                      transform: [{ rotate: "130deg" }],
                    },
                  ]}
                />
                <Image
                  source={{
                    uri: Image.resolveAssetSource(
                      CARDS_BACK.find((c) => c.id === environment?.backCover)
                        ?.src || CARDS_BACK.find((c) => c.id === "black")!.src
                    ).uri,
                  }}
                  style={[
                    _styles.card__image,
                    {
                      transform: [{ rotate: "50deg" }],
                    },
                  ]}
                />
                <Image
                  source={{
                    uri: Image.resolveAssetSource(
                      CARDS_BACK.find((c) => c.id === environment?.backCover)
                        ?.src || CARDS_BACK.find((c) => c.id === "black")!.src
                    ).uri,
                  }}
                  style={[
                    _styles.card__image,
                    {
                      transform: [{ rotate: "-45deg" }],
                    },
                  ]}
                />
              </View>
            ) : (
              <View
                style={{
                  paddingVertical: 60,
                  position: "relative",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {environment.played.map((card, id) => (
                  <Image
                    key={card.id}
                    source={{
                      uri: Image.resolveAssetSource(
                        CARDS.find((c) => c.id === card.id)?.src
                      ).uri,
                    }}
                    style={[
                      _styles.card__image,
                      {
                        transform: [
                          { rotate: id % 2 === 0 ? "-45deg" : "30deg" },
                        ],
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>

          {!!environment?.next && (
            <View style={{ paddingHorizontal: 10, width: "100%" }}>
              <Message
                error={false}
                message={
                  environment.next.id === gamer?.id
                    ? `it's your turn to play`
                    : `it's ${environment?.next?.nickname}'s turn to play.`
                }
              />
            </View>
          )}
        </View>
        <View
          style={{
            flex: 2,
            padding: 5,
          }}
        >
          {opponents?.length && opponents.length >= 2 && (
            <Player setError={setError} player={opponents[1]} />
          )}
          {opponents?.length && opponents.length >= 4 && (
            <Player setError={setError} player={opponents[3]} />
          )}
        </View>
      </View>
      <View style={{ flex: 0.4, position: "relative", padding: 10 }}>
        {!!error && <Message error message={error} />}
        <View
          style={{
            position: "absolute",
            right: 10,
            backgroundColor: COLORS.main,
            justifyContent: "center",
            alignItems: "center",
            width: 25,
            height: 25,
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.semiBold,
              color: COLORS.white,
              fontSize: 20,
            }}
          >
            {environment?.players.find((player) => player.id === gamer?.id)
              ?.playerNumber || 0}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            flex: 1,
          }}
        >
          {environment?.players
            .find((player) => player.id === gamer?.id)
            ?.cards.map((card, index) => (
              <Card
                show={true}
                card={card}
                key={index}
                pair={pair}
                setPair={setPair}
                setError={setError}
              />
            ))}
        </View>
        <TouchableOpacity
          onPress={playNext}
          activeOpacity={0.7}
          style={[
            styles.button,
            {
              backgroundColor: COLORS.secondary,
              padding: 5,
              borderRadius: 5,
              maxWidth: 80,
            },
          ]}
        >
          <Text style={[styles.button__text, { color: COLORS.white }]}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Environment;

const _styles = StyleSheet.create({
  card__image: {
    width: 40,
    height: 50,
    resizeMode: "contain",
    position: "absolute",
  },
});