import { Engine } from "@blackjack/server";
import { CImage } from "@coreui/react";
import React from "react";
import GameEngineModal from "../GameEngineModal/GameEngineModal";
import styles from "./Game.module.css";
import EngineOptionsModal from "../EngineOptionsModal/EngineOptionsModal";
import { CARDS_BACK } from "@/constants";

interface Props {
  engine: Engine;
}
const Game: React.FC<Props> = ({ engine }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [engineModal, setEngineModal] = React.useState<boolean>(false);
  return (
    <div
      className={styles.game}
      title={engine.name}
      onClick={() => setOpen(true)}
      onContextMenu={(e) => {
        e.preventDefault();
        setEngineModal(true);
        setOpen(false);
      }}
    >
      <EngineOptionsModal
        open={engineModal}
        engine={engine}
        setOpen={setEngineModal}
      />
      <GameEngineModal open={open} engine={engine} setOpen={setOpen} />
      <div className={styles.game__full} />
      <div className={styles.game__active} />
      <CImage
        alt="game"
        src={CARDS_BACK.find((c) => c.id === engine.cover)!.src}
      />
      <div>
        <p>{engine.name}</p>
      </div>
    </div>
  );
};

export default Game;
