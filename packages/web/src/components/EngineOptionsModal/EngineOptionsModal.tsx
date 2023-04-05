import React from "react";
import styles from "./EngineOptionsModal.module.css";
import { Engine } from "@blackjack/server";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CAlert,
  CModalFooter,
  CButton,
} from "@coreui/react";
interface Props {
  engine: Engine;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const EngineOptionsModal: React.FC<Props> = ({ engine, open, setOpen }) => {
  return (
    <CModal
      visible={open}
      onClose={() => setOpen(false)}
      className={styles.game__engine__modal}
    >
      <CModalHeader className={styles.game__engine__modal__header}>
        <CModalTitle>Join Game Environment - {engine.name}</CModalTitle>
      </CModalHeader>
      <CModalBody className={styles.game__engine__modal__body}>
        <h1>{engine.gamersIds.length} more gamers in the engine.</h1>
      </CModalBody>
      <CModalFooter className={styles.game__engine__modal__footer}>
        <CButton
          className={styles.game__engine__modal__close__btn}
          color="secondary"
          onClick={() => {
            setOpen((state) => !state);
          }}
          //   disabled={isLoading}
        >
          Close
        </CButton>
        <CButton
          className={styles.game__engine__modal__create__btn}
          type="button"
          color="primary"
          //   onClick={onSubmit}
          //   disabled={isLoading}
        >
          Join
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default EngineOptionsModal;
