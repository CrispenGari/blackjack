import { CImage } from "@coreui/react";
import React from "react";
import styles from "./Game.module.css";
interface Props {}
const Game: React.FC<Props> = ({}) => {
  return (
    <div className={styles.game}>
      <div className={styles.game__full} />
      <div className={styles.game__active} />
      <CImage alt="game" src="/monsters/3.jpg" />
    </div>
  );
};

export default Game;
