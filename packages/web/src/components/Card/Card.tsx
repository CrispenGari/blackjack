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
  const { isLoading, mutate } = trpc.game.updateGameEnvironment.useMutation();
  const [matched, setMatched] = React.useState<boolean>(false);
  const [played, setPlayed] = React.useState<CardType[]>([]);
  const { environment, matchCards } = useEnvironmentStore((s) => s);
  const { gamer } = useGamerStore((s) => s);
  const selectCard = async () => {
    const restricted = [...BLACK_JACKS, ...pair!].map((p) => p.id);
    if (restricted.includes(card.id)) return;
    setPair!((state) => [...state, card]);
  };

  const [playNext, setPlayNext] = React.useState(false);
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

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted) {
      if (pair?.length == 2) {
        const values = pair.map((c) => c.value);
        setMatched(values.every((v) => v === values[0]));
        setPlayed(pair);
        setPair!([]);
      } else {
        setMatched(false);
      }
    }
    return () => {
      mounted = false;
    };
  }, [setPair, pair]);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && matched && !!gamer?.id && !!gamer.nickname) {
      matchCards(played, gamer.id, gamer, gamer);
    }
    return () => {
      mounted = false;
    };
  }, [matched, gamer, played, matchCards]);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!environment && !!matched) {
      (async () => {
        await mutate(environment);
      })();
    }
    return () => {
      mounted = false;
    };
  }, [environment, mutate, matched]);

  const handleClickCard = () => {
    if (!!!currentPlayer || !!!gamer) return;
    // you are not supposed to play
    if (currentPlayer.id !== gamer.id && typeof setError !== "undefined") {
      setError(`it's ${currentPlayer.nickname}'s turn to play.`);
      return;
    }
    typeof setError !== "undefined" && setError("");
    if (environment?.next) if (isLoading) return;
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
