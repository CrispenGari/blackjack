import React from "react";
import styles from "./Oponent.module.css";
import { CButton } from "@coreui/react";
import { GamerType } from "@blackjack/server";
import { trpc } from "@/utils/trpc";
interface Props {
  player: GamerType;
}
const Oponent: React.FC<Props> = ({ player }) => {
  const { mutate, isLoading, data } = trpc.game.removeGamer.useMutation();
  const removePlayer = async () => {
    await mutate({ gamerId: player.id });
  };
  return (
    <div className={styles.oponent}>
      <p>{player.nickname}</p>
      <CButton
        disabled={isLoading}
        onClick={removePlayer}
        className={styles.oponent__btn}
      >
        remove
      </CButton>
    </div>
  );
};

export default Oponent;
