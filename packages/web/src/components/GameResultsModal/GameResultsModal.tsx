import React from "react";
import styles from "./GameResultsModal.module.css";
import { Engine } from "@blackjack/server";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTable,
  CTableHeaderCell,
  CTableHead,
  CTableRow,
  CTableDataCell,
  CTableBody,
} from "@coreui/react";
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  positions: Array<{
    nickname: string;
    points: number;
    position: number;
  }>;
}
const GameResultsModal: React.FC<Props> = ({ open, setOpen, positions }) => {
  return (
    <CModal
      visible={open}
      onClose={() => setOpen(false)}
      className={styles.game__results__modal}
    >
      <CModalHeader className={styles.game__results__modal__header}>
        <CModalTitle>Game Over</CModalTitle>
      </CModalHeader>
      <CModalBody className={styles.game__results__modal__body}>
        <h1>GAME RESULTS</h1>
        <CTable color="dark">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">nickname</CTableHeaderCell>
              <CTableHeaderCell scope="col">position</CTableHeaderCell>
              <CTableHeaderCell scope="col">points</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {positions.map((pos) => (
              <CTableRow
                color={
                  pos.points === -1
                    ? "danger"
                    : pos.points < 3
                    ? "warning"
                    : "primary"
                }
                key={pos.nickname}
              >
                <CTableHeaderCell scope="row">{pos.nickname}</CTableHeaderCell>
                <CTableDataCell>{pos.position}</CTableDataCell>
                <CTableDataCell>{pos.points}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CModalBody>
      <CModalFooter className={styles.game__results__modal__footer}>
        <CButton
          className={styles.game__results__modal__close__btn}
          color="secondary"
          onClick={() => {
            setOpen((state) => !state);
          }}
          //   disabled={isLoading}
        >
          Close
        </CButton>
        <CButton
          className={styles.game__results__modal__create__btn}
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

export default GameResultsModal;
