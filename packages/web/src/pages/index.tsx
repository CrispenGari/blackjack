import React from "react";
import styles from "@/styles/Home.module.css";
import { trpc } from "@/utils/trpc";
import { Loading } from "@/components";
import { useRouter } from "next/router";
import { useGamerStore } from "@/store";

interface Props {}

const Home: React.FC<Props> = ({}) => {
  const { data, isLoading } = trpc.gamer.gamer.useQuery();
  const { setGamer, gamer } = useGamerStore((state) => state);
  const router = useRouter();
  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!data) {
      setGamer(data.gamer as any);
    }
    return () => {
      mounted = false;
    };
  }, [data, setGamer]);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!!isLoading) {
      if (!!gamer?.loggedIn) {
        router.replace("/games");
      } else {
        router.replace("/auth/login");
      }
    }
    return () => {
      mounted = false;
    };
  }, [isLoading, router, gamer]);
  if (isLoading) return <Loading />;
  return (
    <div className={styles.home}>
      <Loading />
    </div>
  );
};

export default Home;
