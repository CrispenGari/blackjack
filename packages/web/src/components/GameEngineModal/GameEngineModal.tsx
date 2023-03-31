import { useGamerStore } from "@/store";
import { trpc } from "@/utils/trpc";
import { Engine } from "@blackjack/server";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CAlert,
  CModalFooter,
  CButton,
} from "@coreui/react";
import { useRouter } from "next/router";
import React from "react";
import styles from "./GameEngineModal.module.css";
interface Props {
  engine: Engine;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const GameEngineModal: React.FC<Props> = ({ engine, setOpen, open }) => {
  const router = useRouter();
  const { gamer } = useGamerStore((state) => state);
  const { data, mutate, isLoading } = trpc.engine.joinEngine.useMutation();
  const onSubmit = async () => {
    if (!!engine.gamersIds.find((i) => i === gamer?.id)) {
      // automatically join
      router.push(`/games/game/${engine.id}`);
    } else {
      // do some logic to join
      await mutate({ engineId: engine.id });
      // router.push(`/games/game/${engine.id}`);
    }
  };
  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!data?.engine) {
      router.push(`/games/game/${data.engine.id}`);
    }
    return () => {
      mounted = false;
    };
  }, [data, router]);

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
        <h1>{engine.gamersIds.length} more gamers</h1>
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
      <CModalFooter className={styles.game__engine__modal__footer}>
        <CButton
          className={styles.game__engine__modal__close__btn}
          color="secondary"
          onClick={() => {
            setOpen((state) => !state);
          }}
          disabled={isLoading}
        >
          Close
        </CButton>
        <CButton
          className={styles.game__engine__modal__create__btn}
          type="button"
          color="primary"
          onClick={onSubmit}
          disabled={isLoading}
        >
          Join
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default GameEngineModal;
