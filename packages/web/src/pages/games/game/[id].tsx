import React from "react";
import styles from "@/styles/Game.module.css";
interface Props {}
const Game: React.FC<Props> = ({}) => {
  return (
    <div className={styles.game}>
      <h1>Hello from Game</h1>
    </div>
  );
};

export default Game;
