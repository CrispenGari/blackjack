import { BLACK_JACKS } from "@/constants";
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
  const onSubmit = async () => {
    await mutate({ engineId: engine.id, blackJack: jack.id });
  };

  return (
    <CModal
      visible={open}
      onClose={() => setOpen(false)}
      className={styles.start__game__modal}
    >
      <CModalHeader className={styles.start__game__modal__header}>
        <CModalTitle>Join Game Environment - {engine.name}</CModalTitle>
      </CModalHeader>
      <CModalBody className={styles.start__game__modal__body}>
        <h1>{engine.gamersIds.length} more gamers</h1>
        <h2>Select Black Jack</h2>
        <div className={styles.start__game__modal__body__jacks}>
          {BLACK_JACKS.map((_jack) => (
            <div
              onClick={() => setJack(_jack)}
              key={_jack.id}
              className={
                jack.id === _jack.id
                  ? styles.start__game__modal__body__jack__active
                  : styles.start__game__modal__body__jack
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

        {!!data?.error && (
          <CAlert
            style={{ marginTop: 10, userSelect: "none" }}
            color="danger"
            variant="solid"
          >
            <p>{data.error.message}</p>
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
