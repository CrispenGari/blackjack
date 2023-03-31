import { useGamerStore } from "@/store";
import { trpc } from "@/utils/trpc";
import { CButton, CImage } from "@coreui/react";
import { useRouter } from "next/router";
import React from "react";
import styles from "./Header.module.css";
interface Props {}
const Header: React.FC<Props> = ({}) => {
  const { mutate, isLoading, data } = trpc.gamer.logout.useMutation();
  const { setGamer } = useGamerStore((state) => state);
  const router = useRouter();
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
      <CImage src="/logo.png" alt="logo" onClick={() => router.replace("/")} />
      <div className={styles.header__right}>
        <CButton onClick={logout} disabled={isLoading}>
          Sign Out
        </CButton>
      </div>
    </div>
  );
};

export default Header;
