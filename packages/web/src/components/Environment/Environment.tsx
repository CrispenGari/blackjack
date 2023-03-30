import React from "react";
import styles from "./Environment.module.css";
interface Props {}
const Environment: React.FC<Props> = ({}) => {
  return (
    <div className={styles.environment}>
      <div className={styles.environment__header}>
        <h1>Header</h1>
      </div>
      <div className={styles.environment__main}>
        <h1>Main</h1>
      </div>
    </div>
  );
};

export default Environment;
