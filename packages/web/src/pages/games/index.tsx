import React from "react";
import styles from "@/styles/Game.module.css";
interface Props {}
const Games: React.FC<Props> = ({}) => {
  return (
    <div className={styles.game}>
      <h1>Hello from Games</h1>
    </div>
  );
};

export default Games;
