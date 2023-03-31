import { Engine } from "@blackjack/server";
import { CImage } from "@coreui/react";
import React from "react";
import GameEngineModal from "../GameEngineModal/GameEngineModal";
import styles from "./Game.module.css";

interface Props {
  engine: Engine;
}
const Game: React.FC<Props> = ({ engine }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <div
      className={styles.game}
      title={engine.name}
      onClick={() => setOpen(true)}
    >
      <GameEngineModal open={open} engine={engine} setOpen={setOpen} />
      <div className={styles.game__full} />
      <div className={styles.game__active} />
      <CImage alt="game" src="/monsters/3.jpg" />
    </div>
  );
};

export default Game;
