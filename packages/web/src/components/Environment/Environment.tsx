import { useEnvironmentStore, useGamerStore } from "@/store";
import { CardType, Engine, Gamer, Message } from "@blackjack/server";
import { CButton, CImage } from "@coreui/react";
import React from "react";
import Card from "../Card/Card";
import Player from "../Player/Player";
import StartGameModal from "../StartGameModal/StartGameModal";
import styles from "./Environment.module.css";
interface Props {
  engine: Engine & {
    messages: (Message & {
      sender: Gamer;
    })[];
  };
}
const Environment: React.FC<Props> = ({ engine }) => {
  const { gamer } = useGamerStore((state) => state);
  const [pair, setPair] = React.useState<CardType[]>([]);
  const { environment } = useEnvironmentStore((state) => state);
  const [open, setOpen] = React.useState<boolean>(false);

  const opponents = environment?.players.filter(
    (player) => player.id !== gamer?.id
  );

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
            {environment?.lastPlayer === ""
              ? "you can play first."
              : `${
                  environment?.lastPlayer === gamer?.nickname
                    ? "you are the last to play"
                    : `${environment?.lastPlayer || ""} is the last one played.`
                } `}
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
        {environment?.players
          .find((player) => player.id === gamer?.id)
          ?.cards.map((card, index) => (
            <Card
              show={true}
              card={card}
              key={index}
              pair={pair}
              setPair={setPair}
            />
          ))}
      </div>
    </div>
  );
};

export default Environment;
