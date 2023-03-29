import { trpc } from "@/utils/trpc";
import { CButton, CImage } from "@coreui/react";
import React from "react";
import styles from "./Header.module.css";
interface Props {}
const Header: React.FC<Props> = ({}) => {
  const { mutate, isLoading, data } = trpc.gamer.logout.useMutation();
  const logout = async () => {
    await mutate();
  };

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!data) {
      window.location.reload();
    }
    return () => {
      mounted = false;
    };
  }, [data]);

  return (
    <div className={styles.header}>
      <CImage src="/logo.png" alt="logo" />
      <div className={styles.header__right}>
        <CButton onClick={logout}>Sign Out</CButton>
      </div>
    </div>
  );
};

export default Header;
