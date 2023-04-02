import React from "react";
import Card from "../Card/Card";
import styles from "./Player.module.css";
import { CardType } from "@blackjack/server";
import { useEnvironmentStore, useGamerStore } from "@/store";
import { trpc } from "@/utils/trpc";
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
}
const Player: React.FC<Props> = ({ player }) => {
  const { environment, pickCard: choseCard } = useEnvironmentStore((s) => s);
  const { isLoading, mutate } = trpc.game.updateGameEnvironment.useMutation();
  const { gamer } = useGamerStore((s) => s);
  const [selected, setSelected] = React.useState<boolean>(false);

  const pickCard = async (card: CardType) => {
    if (isLoading) return;
    if (!!environment && !!card && !!gamer?.id && !!player.id) {
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
    <div className={styles.player}>
      <div className={styles.player__number}>{player.playerNumber}</div>
      <h1>{player.nickname}</h1>
      <p>{`${player.nickname}'s turn • got ${player.total} cards • left with ${player.cards.length} cards.`}</p>
      <div className={styles.player__cards}>
        {player.cards
          .sort((card) => Math.random() - 0.5)
          .map((card) => (
            <Card
              onClick={() => pickCard(card)}
              show={false}
              card={card}
              key={card.id}
            />
          ))}
      </div>
    </div>
  );
};

export default Player;
