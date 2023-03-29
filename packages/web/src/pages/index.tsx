import React from "react";
import styles from "@/styles/Home.module.css";
import { trpc } from "@/utils/trpc";
import { CButton } from "@coreui/react";

interface Props {}

const Home: React.FC<Props> = ({}) => {
  const { data } = trpc.gamer.gamer.useQuery();
  const { mutate, isLoading } = trpc.gamer.logout.useMutation();
  const logout = async () => {
    await mutate();
    window.location.reload();
  };
  console.log({ data });

  return (
    <div className={styles.home}>
      <CButton onClick={logout} disabled={isLoading}>
        Logout
      </CButton>
    </div>
  );
};

export default Home;
