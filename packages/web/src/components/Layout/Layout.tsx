import React from "react";
import H from "../Head/Head";
import styles from "./Layout.module.css";
interface Props {
  children: React.ReactNode;
}
const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <H />
      <div className={styles.layout}>{children}</div>
    </>
  );
};
export default Layout;
