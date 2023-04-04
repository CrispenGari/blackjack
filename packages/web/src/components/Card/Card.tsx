import { useEnvironmentStore, useGamerStore } from "@/store";
import { trpc } from "@/utils/trpc";
import { CardType, GamerType } from "@blackjack/server";
import { CImage } from "@coreui/react";
import React from "react";
import styles from "./Card.module.css";
import { BLACK_JACKS, CARDS_BACK } from "@/constants";
interface Props {
  card: CardType;
  show: boolean;
  setPair?: React.Dispatch<React.SetStateAction<CardType[]>>;
  pair?: CardType[];
  onClick?: () => void;
  setError?: React.Dispatch<React.SetStateAction<string>>;
}
const Card: React.FC<Props> = ({
  card,
  show,
  setPair,
  pair,
  onClick,
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
    if (typeof onClick === "undefined") {
      selectCard();
      return;
    }
    onClick();
  };
  return (
    <div
      role={"button"}
      className={show ? styles.card : styles.card__anonymous}
      onClick={handleClickCard}
      style={{
        backgroundColor: !!pair?.find((c) => c.id === card.id)
          ? "#395144"
          : "transparent",
      }}
    >
      <CImage
        alt="card"
        src={
          show
            ? `/cards/svg/${card.id.toLocaleLowerCase()}.svg`
            : CARDS_BACK.find((c) => c.id === environment?.backCover)?.src
        }
      />
    </div>
  );
};

export default Card;
