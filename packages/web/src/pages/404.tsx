import React from "react";
import styles from "@/styles/NotFound.module.css";
import { CImage } from "@coreui/react";
import Link from "next/link";
interface Props {}
const NotFound: React.FC<Props> = ({}) => {
  return (
    <div className={styles.not__found}>
      <h1>404</h1>
      <CImage src="/logo.png" alt="logo" />
      <p>Page Not Found</p>

      <div className={styles.not__found__links}>
        <Link href="/">Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
