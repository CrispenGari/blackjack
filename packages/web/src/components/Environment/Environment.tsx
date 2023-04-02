import { useEnvironmentStore, useGamerStore } from "@/store";
import {
  CardType,
  Engine,
  EnvironmentType,
  Gamer,
  Message,
} from "@blackjack/server";
import { CAlert, CButton, CImage } from "@coreui/react";
import React from "react";
import Card from "../Card/Card";
import Player from "../Player/Player";
import StartGameModal from "../StartGameModal/StartGameModal";
import styles from "./Environment.module.css";
import { trpc } from "@/utils/trpc";
interface Props {
  engine: Engine & {
    messages: (Message & {
      sender: Gamer;
    })[];
  };
}
const Environment: React.FC<Props> = ({ engine }) => {
  const { gamer } = useGamerStore((state) => state);
  const { isLoading, mutate } = trpc.game.updateNextPlayer.useMutation();
  const [pair, setPair] = React.useState<CardType[]>([]);
  const { environment } = useEnvironmentStore((state) => state);
  const [open, setOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const opponents = environment?.players.filter(
    (player) => player.id !== gamer?.id
  );
  const playNext = async () => {
    if (!!!gamer || !!!environment) return;
    const players = environment.players;
    const total = players.length;
    const me = players.find((p) => p.id === gamer.id);
    if (!!!me) return;
    const index: number = me?.playerNumber === total ? 1 : me.playerNumber + 1;
    const nextPlayer = players[index - 1];
    await mutate({
      env: environment,
      last: me,
      next: nextPlayer,
    });
  };

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!environment) {
      (async (env) => {
        // await mutate(env);
      })(environment);
    }
    return () => {
      mounted = false;
    };
  }, [environment]);

  return (
    <div className={styles.environment}>
      <StartGameModal engine={engine} open={open} setOpen={setOpen} />
      <div className={styles.environment__top}>
        <div className={styles.environment__top__left}>
          {opponents?.length && opponents.length >= 1 && (
            <Player player={opponents[0]} />
          )}
          {opponents?.length && opponents.length >= 3 && (
            <Player player={opponents[2]} />
          )}
        </div>
        <div className={styles.environment__top__center}>
          {engine.adminId === gamer?.id ? (
            <CButton
              onClick={() => setOpen(true)}
              // disabled={engine.playing}
            >
              Start
            </CButton>
          ) : engine.playing ? (
            <p>the game has started</p>
          ) : (
            <p>Only the admin of the environment can start the game.</p>
          )}
          <div className={styles.environment__top__center__cards}>
            {!!!environment?.played.length ? (
              <>
                <div className={styles.environment__top__center__card}>
                  <CImage alt="card" src={`/cards/back/back.jpg`} />
                </div>
                <div className={styles.environment__top__center__card}>
                  <CImage alt="card" src={`/cards/back/back.jpg`} />
                </div>
                <div className={styles.environment__top__center__card}>
                  <CImage alt="card" src={`/cards/back/back.jpg`} />
                </div>
              </>
            ) : (
              environment.played.map((card, id) => (
                <div key={id} className={styles.environment__top__center__card}>
                  <CImage
                    alt="card"
                    src={`/cards/svg/${card.id.toLowerCase()}.svg`}
                  />
                </div>
              ))
            )}
          </div>
          <p>
            {!!environment?.next
              ? environment.next.id === gamer?.id
                ? `it's your turn to play`
                : `it's ${environment?.next?.nickname}'s turn to play.`
              : null}
          </p>
          <p>
            {!!environment?.last
              ? environment.last.id === gamer?.id
                ? `you the last one to play`
                : `it's ${environment?.next?.nickname} who last played.`
              : null}
          </p>
        </div>
        <div className={styles.environment__top__right}>
          {opponents?.length && opponents.length >= 2 && (
            <Player player={opponents[1]} />
          )}
          {opponents?.length && opponents.length >= 4 && (
            <Player player={opponents[3]} />
          )}
        </div>
      </div>

      <div className={styles.environment__bottom}>
        <div className={styles.environment__bottom__player__number}>
          {environment?.players.find((player) => player.id === gamer?.id)
            ?.playerNumber || 0}
        </div>

        {!!error && (
          <CAlert
            style={{ margin: 3, userSelect: "none", padding: 5, minWidth: 0 }}
            color="danger"
            variant="solid"
          >
            {error}
          </CAlert>
        )}
        <div className={styles.environment__bottom__cards}>
          {environment?.players
            .find((player) => player.id === gamer?.id)
            ?.cards.map((card, index) => (
              <Card
                show={true}
                card={card}
                key={index}
                pair={pair}
                setPair={setPair}
                setError={setError}
              />
            ))}
        </div>

        <CButton
          onClick={playNext}
          disabled={environment?.next?.id !== gamer?.id || isLoading}
        >
          Done
        </CButton>
      </div>
    </div>
  );
};

export default Environment;
