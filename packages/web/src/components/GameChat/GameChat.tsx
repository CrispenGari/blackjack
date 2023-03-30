import React from "react";
import styles from "./GameChat.module.css";
interface Props {}
const GameChat: React.FC<Props> = ({}) => {
  return (
    <div className={styles.game__chat}>
      <div className={styles.game__chat}>
        <h1>Header</h1>
      </div>
      <div className={styles.game__chat}>
        <h1>Main</h1>
      </div>
    </div>
  );
};

export default GameChat;
