import React from "react";
import styles from "./Oponent.module.css";
import { CButton } from "@coreui/react";
import { GamerType } from "@blackjack/server";
import { trpc } from "@/utils/trpc";
import { useGamerStore } from "@/store";
interface Props {
  player: GamerType;
  adminId?: string;
}
const Oponent: React.FC<Props> = ({ player, adminId }) => {
  const { mutate, isLoading } = trpc.game.removeGamer.useMutation();
  const { gamer } = useGamerStore((s) => s);
  const removePlayer = async () => {
    await mutate({ gamerId: player.id });
  };
  return (
    <div className={styles.oponent}>
      <p>{player.nickname}</p>
      <CButton
        disabled={isLoading || gamer?.id !== adminId}
        onClick={removePlayer}
        className={styles.oponent__btn}
      >
        remove
      </CButton>
    </div>
  );
};

export default Oponent;
