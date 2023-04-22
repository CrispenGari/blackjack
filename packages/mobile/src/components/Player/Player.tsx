import { View, Text } from "react-native";
import React from "react";
import { GamerType, CardType } from "@blackjack/server";
import { useEnvironmentStore, useGamerStore } from "../../store";
import { trpc } from "../../utils/trpc";
import Card from "../Card/Card";
import { COLORS, FONTS } from "../../constants";

interface Props {
  player: {
    password: string;
    total: number;
    cards: {
      id: string;
      value: string;
      index: number;
    }[];
    id: string;
    nickname: string;
    loggedIn: boolean;
    createdAt: Date;
    updatedAt: Date;
    playerNumber: number;
  };
  setError?: React.Dispatch<React.SetStateAction<string>>;
  playing: boolean;
}
const Player: React.FunctionComponent<Props> = ({
  player,
  setError,
  playing,
}) => {
  const { environment, pickCard: choseCard } = useEnvironmentStore((s) => s);
  const { isLoading, mutate } = trpc.game.updateGameEnvironment.useMutation();
  const { gamer } = useGamerStore((s) => s);
  const [selected, setSelected] = React.useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = React.useState<
    GamerType | null | undefined
  >();
  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!environment?.next) {
      setCurrentPlayer(environment.next);
    }
    return () => {
      mounted = false;
    };
  }, [environment]);
  const pickCard = async (card: CardType) => {
    if (
      !!!currentPlayer ||
      !!!environment ||
      !!!card ||
      !!!gamer ||
      !!!player ||
      isLoading
    )
      return;
    // check if it is your turn to play
    if (currentPlayer.id !== gamer.id && typeof setError !== "undefined") {
      setError(`it's ${currentPlayer.nickname}'s turn to play.`);
      return;
    }
    const totalPlayers: number = environment.players.length;
    const myNumber: number = environment.players.find(
      (p) => p.id === gamer.id
    )!.playerNumber;

    const pickFrom: number = totalPlayers === myNumber ? 1 : myNumber + 1;
    if (pickFrom === player.playerNumber) {
      choseCard(card, player.id, gamer.id);
      setSelected(true);
    }
  };
  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!environment && selected) {
      (async (env) => {
        await mutate(env);
        setSelected(false);
      })(environment);
    }
    return () => {
      mounted = false;
    };
  }, [environment, mutate, selected]);

  return (
    <View style={{}}>
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
          {player.playerNumber}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          color: COLORS.main,
          fontSize: 20,
        }}
      >
        {player.nickname}
      </Text>
      <Text
        style={{
          fontFamily: FONTS.regular,
          color: COLORS.main,
        }}
      >{`${player.nickname}'s turn • got ${player.total} cards • left with ${player.cards.length} cards.`}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {player.cards
          .sort((_) => Math.random() - 0.5)
          .map((card) => (
            <Card
              onPress={() => pickCard(card)}
              show={false}
              card={card}
              key={card.id}
              playing={playing}
            />
          ))}
      </View>
    </View>
  );
};

export default Player;
