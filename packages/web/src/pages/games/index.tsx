import React from "react";
import styles from "@/styles/Game.module.css";
import { Header } from "@/components";
import { useRouter } from "next/router";
import { useGamerStore } from "@/store";
interface Props {}
const Games: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { gamer } = useGamerStore((state) => state);
  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!!gamer?.loggedIn) {
      router.replace("/auth/login");
    }
    return () => {
      mounted = false;
    };
  }, [router, gamer]);

  return (
    <div className={styles.games}>
      <Header />
      <div className={styles.games__main}></div>
    </div>
  );
};

export default Games;
