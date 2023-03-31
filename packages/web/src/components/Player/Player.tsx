import React from "react";
import Card from "../Card/Card";
import styles from "./Player.module.css";
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
    enginesIds: string[];
    createdAt: Date;
    updatedAt: Date;
  };
}
const Player: React.FC<Props> = ({ player }) => {
  return (
    <div className={styles.player}>
      <h1>{player.nickname}</h1>
      <p>{`${player.nickname}'s turn • got ${player.total} cards • left with ${player.cards.length} cards.`}</p>
      <div className={styles.player__cards}>
        {player.cards
          .sort((card) => Math.random() - 0.5)
          .map((card) => (
            <Card show={false} card={card} key={card.id} />
          ))}
      </div>
    </div>
  );
};

export default Player;
