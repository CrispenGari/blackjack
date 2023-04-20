import React from "react";
import { useGamerStore } from "../store";
import { trpc } from "../utils/trpc";
import { NavigationContainer } from "@react-navigation/native";
import Game from "./game";
import Auth from "./auth";
import { Loading } from "../components";

const Routes = () => {
  const { data, isLoading } = trpc.gamer.gamer.useQuery();
  const { setGamer, gamer } = useGamerStore((state) => state);
  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!data) {
      setGamer(data.gamer as any);
    }
    return () => {
      mounted = false;
    };
  }, [data, setGamer]);

  if (isLoading) return <Loading loadedFont={true} />;
  return (
    <NavigationContainer>{gamer ? <Game /> : <Auth />}</NavigationContainer>
  );
};

export default Routes;
