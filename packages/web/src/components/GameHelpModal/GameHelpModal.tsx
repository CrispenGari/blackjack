import React from "react";
import styles from "./GameHelpModal.module.css";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CAlert,
  CModalFooter,
  CButton,
  CImage,
} from "@coreui/react";

import { store } from "@/utils";
import { INSTRUCTIONS_KEY } from "@/constants";
import { useGamerStore } from "@/store";
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const GameHelpModal: React.FC<Props> = ({ open, setOpen }) => {
  const { gamer } = useGamerStore((s) => s);
  return (
    <CModal
      visible={open}
      onClose={() => setOpen(false)}
      className={styles.game__help__modal}
    >
      <CModalHeader className={styles.game__help__modal__header}>
        <CModalTitle> Game Instructions</CModalTitle>
      </CModalHeader>

      <CModalBody className={styles.game__help__modal__body}>
        <p> Please read the game instructions before you start the game.</p>
        <CAlert
          style={{ marginTop: 10, userSelect: "none" }}
          color="info"
          variant="solid"
        >
          Everyone has a equal chance to win the game.
        </CAlert>

        <div className={styles.game__help__modal__instructions}>
          <p>
            1. Since it is a multiple player game, every gammer has a number and
            the playing turns moves in ascending order of numbers meaning: _
            player number 1 plays first and the last player will play last.
          </p>
          <p>
            2. Note that the maximum number of players allowed to be in a game
            engine or environment are 5 players and minimum for the game to be
            able to start are 2 players.
          </p>
          <p>
            3. You match cards that have same name for example a Q and a Q, a 2
            and a 2, it {"doesn't"} mater which Q is it. It can be of hearts,
            clubs, spades or diamonds. Here is an example of matching cards.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CImage alt="jack" src={"/cards/svg/4_of_clubs.svg"} />
            <CImage alt="jack" src={"/cards/svg/4_of_hearts.svg"} />
          </div>

          <p>
            So to match these cards you just need to click the first card and
            click the next one, then your cards will be updated.
          </p>
          <p>
            4. In the event that your matching cards are finished you click the
            DONE button so that the next player in ascending will play next.
          </p>
          <p>
            5. After all the matching cards has been finished on all the gamers,
            now gamers can start picking up the cards for the next ascending
            player. When you see that you picked thematching card you can match
            and click DONE button so that the next player will also pick from
            whoever he should pick from.
          </p>
          <p>
            6. Note that if you pick a card, as an important rule if the card
            match play it and click the DONE button if not just click the DONE
            button so that next players get their chances.
          </p>
          <p>
            7. The process will be looped till all the cards are finished. The
            player that will be left with JACK_OF_CLUBS or JACK_OF_SPADES will
            loose the game, here are the jacks that we are talking about.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",

              alignItems: "center",
            }}
          >
            <CImage alt="jack" src={"/cards/svg/j_of_clubs.svg"} />
            <CImage alt="jack" src={"/cards/svg/j_of_spades.svg"} />
          </div>
        </div>
      </CModalBody>
      <CModalFooter className={styles.game__help__modal__footer}>
        <CButton
          className={styles.game__help__modal__create__btn}
          type="button"
          color="primary"
          onClick={async () => {
            if (!!gamer) {
              await store(INSTRUCTIONS_KEY, gamer.id);
            }
            setOpen(false);
          }}
        >
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default GameHelpModal;
