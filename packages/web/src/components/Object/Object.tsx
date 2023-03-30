import React from "react";
import styles from "./Object.module.css";
interface Props {}
const Object: React.FC<Props> = ({}) => {
  return (
    <div className={styles.object}>
      <h1>Hello from Object</h1>
    </div>
  );
};

export default Object;
