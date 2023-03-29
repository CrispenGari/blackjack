import { CImage } from "@coreui/react";
import React from "react";
import styles from "./Loading.module.css";
interface Props {}
const Loading: React.FC<Props> = ({}) => {
  return (
    <div className={styles.loading}>
      <CImage src="/logo.png" alt="logo" />
      <p>loading...</p>
    </div>
  );
};

export default Loading;
