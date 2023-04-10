import { BLACK_JACKS, CARDS_BACK } from "@/constants";
import { trpc } from "@/utils/trpc";
import { Engine } from "@blackjack/server";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CAlert,
  CModalFooter,
  CButton,
  CImage,
} from "@coreui/react";
import React from "react";
import styles from "./StartGameModal.module.css";
import { useEnvironmentStore, useGamerStore } from "@/store";
import Oponent from "../Oponent/Oponent";
interface Props {
  engine: Engine;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const StartGameModal: React.FC<Props> = ({ open, setOpen, engine }) => {
  const { mutate, data, isLoading } = trpc.game.startGame.useMutation();
  const [jack, setJack] = React.useState<{
    name: string;
    id: string;
  }>(BLACK_JACKS[0]);
  const [cover, setCover] = React.useState<{
    id: string;
    src: string;
  }>(CARDS_BACK[0]);
  const { environment } = useEnvironmentStore((s) => s);
  const { gamer } = useGamerStore((s) => s);
  const { data: gamers } = trpc.game.gamers.useQuery({
    ids: engine.gamersIds.filter((id) => id !== gamer?.id),
  });
  const onSubmit = async () => {
    await mutate({
      engineId: engine.id,
      blackJack: jack.id,
      backCover: cover.id,
    });
  };

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!data?.blackJack) {
      setOpen(false);
    }
    return () => {
      mounted = false;
    };
  }, [data, setOpen]);

  return (
    <CModal
      visible={open}
      onClose={() => setOpen(false)}
      className={styles.start__game__modal}
    >
      <CModalHeader className={styles.start__game__modal__header}>
        <CModalTitle>Start a New Game - {engine.name}</CModalTitle>
      </CModalHeader>
      <CModalBody className={styles.start__game__modal__body}>
        {!!gamers?.gamers.length && (
          <h1>{gamers?.gamers.length} more gamers</h1>
        )}
        {!!gamers?.gamers.length && (
          <div className={styles.start__game__modal__body__players}>
            {gamers?.gamers
              .filter((player) => player.id !== gamer?.id)
              .map((player) => (
                <Oponent key={player.id} player={player as any} />
              ))}
          </div>
        )}
        <h2>Select Black Jack</h2>
        <div className={styles.start__game__modal__body__jacks}>
          {BLACK_JACKS.map((_jack) => (
            <div
              onClick={() => setJack(_jack)}
              key={_jack.id}
              className={
                jack.id === _jack.id
                  ? styles.start__game__modal__body__card__active
                  : styles.start__game__modal__body__card
              }
            >
              <CImage
                alt="jack"
                src={`/cards/jacks/${_jack.id.toLowerCase()}.svg`}
              />
              <h3>{_jack.name}</h3>
            </div>
          ))}
        </div>
        <h2>Select Card Cover</h2>
        <div className={styles.start__game__modal__body__cards}>
          {CARDS_BACK.map((_cover) => (
            <div
              onClick={() => setCover(_cover)}
              key={_cover.id}
              className={
                cover.id === _cover.id
                  ? styles.start__game__modal__body__card__active
                  : styles.start__game__modal__body__card
              }
            >
              <CImage alt="jack" src={_cover.src} />
              <h3>{_cover.id}</h3>
            </div>
          ))}
        </div>

        {!!data?.error && (
          <CAlert
            style={{ marginTop: 10, userSelect: "none" }}
            color="danger"
            variant="solid"
          >
            {data.error.message}
          </CAlert>
        )}
      </CModalBody>
      <CModalFooter className={styles.start__game__modal__footer}>
        <CButton
          className={styles.start__game__modal__close__btn}
          color="secondary"
          onClick={() => {
            setOpen((state) => !state);
          }}
          disabled={isLoading}
        >
          Close
        </CButton>
        <CButton
          className={styles.start__game__modal__create__btn}
          type="button"
          color="primary"
          onClick={onSubmit}
          disabled={isLoading}
        >
          Shuffle and Dish Cards
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default StartGameModal;
