import { trpc } from "@/utils/trpc";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CAlert,
} from "@coreui/react";
import React from "react";
import styles from "./NewGameModal.module.css";
interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}
const NewGameModal: React.FC<Props> = ({ open, setOpen }) => {
  const { mutate, isLoading, data } = trpc.engine.createEngine.useMutation();
  const [{ name }, setForm] = React.useState<{
    name: string;
  }>({ name: "" });

  const onSubmit = async () => {
    await mutate({ name });
  };
  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!data?.engine) {
      setForm({ name: "" });
      setOpen(false);
    }
    return () => {
      mounted = false;
    };
  }, [setOpen, data]);

  return (
    <CModal
      visible={open}
      onClose={() => setOpen(false)}
      className={styles.new__game__modal}
    >
      <CModalHeader className={styles.new__game__modal__header}>
        <CModalTitle>New Engine</CModalTitle>
      </CModalHeader>
      <CModalBody className={styles.new__game__modal__body}>
        <CForm
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <CFormInput
            type="text"
            placeholder="Engine Name"
            value={name}
            onChange={(e) =>
              setForm((state) => ({ ...state, name: e.target.value }))
            }
          />
          {!!data?.error && (
            <CAlert
              style={{ marginTop: 10, userSelect: "none" }}
              color="danger"
              variant="solid"
            >
              {data.error.message}
            </CAlert>
          )}
        </CForm>
      </CModalBody>
      <CModalFooter className={styles.new__game__modal__footer}>
        <CButton
          className={styles.new__game__modal__close__btn}
          color="secondary"
          onClick={() => setOpen(false)}
          disabled={isLoading}
        >
          Close
        </CButton>
        <CButton
          className={styles.new__game__modal__create__btn}
          type="button"
          color="primary"
          onClick={onSubmit}
          disabled={isLoading}
        >
          Create
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default NewGameModal;
