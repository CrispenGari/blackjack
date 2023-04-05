import { Engine, Gamer } from "@blackjack/server";
import { CImage } from "@coreui/react";
import React from "react";
import GameEngineModal from "../GameEngineModal/GameEngineModal";
import styles from "./Game.module.css";
import EngineOptionsModal from "../EngineOptionsModal/EngineOptionsModal";
import { CARDS_BACK, relativeTimeObject } from "@/constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
interface Props {
  engine: Engine & { admin: Gamer };
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
      <CImage
        alt="game"
        src={CARDS_BACK.find((c) => c.id === engine.cover)!.src}
      />
      <div className={styles.game__engine__details}>
        <p>
          <span>engine name:</span>
          <span>{engine.name}</span>
        </p>
        <p>
          <span>admin:</span>
          <span>{engine.admin.nickname}</span>
        </p>
        <p>
          <span>created:</span>
          <span>{dayjs(engine.createdAt).fromNow()} ago</span>
        </p>
      </div>
    </div>
  );
};

export default Game;
