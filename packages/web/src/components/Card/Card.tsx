import { useEnvironmentStore, useGamerStore } from "@/store";
import { trpc } from "@/utils/trpc";
import { CardType } from "@blackjack/server";
import { CImage } from "@coreui/react";
import React from "react";
import styles from "./Card.module.css";
import { BLACK_JACKS } from "@/constants";
interface Props {
  card: CardType;
  show: boolean;
  setPair?: React.Dispatch<React.SetStateAction<CardType[]>>;
  pair?: CardType[];
  onClick?: () => void;
}
const Card: React.FC<Props> = ({ card, show, setPair, pair, onClick }) => {
  const { isLoading, data, mutate } =
    trpc.game.updateGameEnvironment.useMutation();
  const [matched, setMatched] = React.useState<boolean>(false);
  const [played, setPlayed] = React.useState<CardType[]>([]);
  const { environment, matchCards } = useEnvironmentStore((s) => s);
  const { gamer } = useGamerStore((s) => s);
  const selectCard = async () => {
    const restricted = [...BLACK_JACKS, ...pair!].map((p) => p.id);
    if (restricted.includes(card.id)) return;
    setPair!((state) => [...state, card]);
  };

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
      matchCards(played, gamer.id as string, gamer.nickname);
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

  return (
    <div
      role={"button"}
      className={show ? styles.card : styles.card__anonymous}
      onClick={() => {
        if (isLoading) return;
        if (typeof onClick === "undefined") {
          selectCard();
          return;
        }
        onClick();
      }}
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
            : `/cards/back/back.jpg`
        }
      />
    </div>
  );
};

export default Card;
