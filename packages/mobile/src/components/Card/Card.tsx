import { TouchableOpacity, Image } from "react-native";
import React from "react";
import { CardType, GamerType } from "@blackjack/server";
import { BLACK_JACKS, CARDS, CARDS_BACK } from "../../constants";
import { useEnvironmentStore, useGamerStore } from "../../store";
interface Props {
  card: CardType;
  show: boolean;
  setPair?: React.Dispatch<React.SetStateAction<CardType[]>>;
  pair?: CardType[];
  onPress?: () => void;
  setError?: React.Dispatch<React.SetStateAction<string>>;
}
const Card: React.FC<Props> = ({
  card,
  show,
  setPair,
  pair,
  onPress,
  setError,
}) => {
  const { environment } = useEnvironmentStore((s) => s);
  const { gamer } = useGamerStore((s) => s);
  const selectCard = async () => {
    const _pair = typeof pair !== "undefined" ? pair : [];
    const restricted = [...BLACK_JACKS, ..._pair].map((p) => p.id);
    if (restricted.includes(card.id)) return;
    if (typeof setPair !== "undefined") setPair((state) => [...state, card]);
  };
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

  const handleClickCard = () => {
    if (!!!currentPlayer || !!!gamer) return;
    // you are not supposed to play
    if (currentPlayer.id !== gamer.id && typeof setError !== "undefined") {
      setError(`it's ${currentPlayer.nickname}'s turn to play.`);
      return;
    }
    typeof setError !== "undefined" && setError("");
    if (typeof onPress === "undefined") {
      selectCard();
      return;
    }
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handleClickCard}
      style={{
        backgroundColor: !!pair?.find((c) => c.id === card.id)
          ? "#395144"
          : "transparent",
        width: 40,
        margin: 2,
        height: 50,
        padding: 2,
        borderRadius: 5,
      }}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: show
            ? Image.resolveAssetSource(CARDS.find((c) => c.id === card.id)!.src)
                .uri
            : Image.resolveAssetSource(
                CARDS_BACK.find((c) => c.id === environment?.backCover)?.src
              ).uri,
        }}
        style={[
          {
            width: "100%",
            flex: 1,
            resizeMode: "contain",
          },
        ]}
      />
    </TouchableOpacity>
  );
};

export default Card;
