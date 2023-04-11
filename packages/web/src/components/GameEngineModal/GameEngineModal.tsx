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
import Oponent from "../Oponent/Oponent";
interface Props {
  engine: Engine;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const GameEngineModal: React.FC<Props> = ({ engine, setOpen, open }) => {
  const router = useRouter();
  const { data, mutate, isLoading } = trpc.engine.joinEngine.useMutation();
  const { gamer } = useGamerStore((s) => s);
  const { data: gamers } = trpc.game.gamers.useQuery({
    ids: engine.gamersIds.filter((id) => id !== gamer?.id),
  });
  const {
    data: deleteEngineData,
    mutate: mutateDeleteEngine,
    isLoading: deleting,
  } = trpc.engine.deleteEngine.useMutation();
  const onSubmit = async () => {
    await mutate({ engineId: engine.id });
  };
  const deleteEngine = async () => {
    await mutateDeleteEngine({ engineId: engine.id });
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
        <h1>
          {gamers?.gamers.length}{" "}
          {gamers?.gamers.length === 1 ? "opponent" : "opponents"} in the
          engine.
        </h1>
        <div className={styles.game__engine__modal__body__players}>
          {gamers?.gamers.map((player) => (
            <Oponent
              key={player.id}
              player={player as any}
              adminId={engine.adminId}
            />
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
        {!!deleteEngineData?.error && (
          <CAlert
            style={{ marginTop: 10, userSelect: "none" }}
            color="danger"
            variant="solid"
          >
            <p>{deleteEngineData.error.message}</p>
          </CAlert>
        )}
      </CModalBody>
      <CModalFooter className={styles.game__engine__modal__footer}>
        {engine.adminId === gamer?.id && (
          <CButton
            className={styles.game__engine__modal__close__btn}
            color="secondary"
            onClick={deleteEngine}
            disabled={isLoading || deleting}
          >
            Delete Engine
          </CButton>
        )}
        <CButton
          className={styles.game__engine__modal__create__btn}
          type="button"
          color="primary"
          onClick={onSubmit}
          disabled={isLoading || deleting}
        >
          Join
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default GameEngineModal;
