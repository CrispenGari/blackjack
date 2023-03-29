import React from "react";
import styles from "@/styles/Login.module.css";
import { CForm, CImage, CFormInput, CAlert, CButton } from "@coreui/react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useGamerStore } from "@/store";
interface Props {}
const Login: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { gamer } = useGamerStore((state) => state);
  const [{ nickname, password }, setForm] = React.useState<{
    nickname: string;
    password: string;
  }>({ nickname: "", password: "" });

  const { data, mutate, isLoading } = trpc.gamer.login.useMutation();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await mutate({ nickname, password, web: true });
  };

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!data?.gamer) {
      router.replace("/");
    }
    return () => {
      mounted = false;
    };
  }, [data, router]);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!gamer?.loggedIn) {
      router.replace("/");
    }
    return () => {
      mounted = false;
    };
  }, [router, gamer]);

  return (
    <div className={styles.login}>
      <div className={styles.login__left}>
        <CForm onSubmit={onSubmit}>
          <h1>blackjack</h1>
          <CImage src="/logo.png" alt="logo" />
          <h2>Welcome back to the games!!</h2>
          <CFormInput
            type="text"
            placeholder="nickname"
            className={styles.login__left__input}
            value={nickname}
            onChange={(e) =>
              setForm((state) => ({ ...state, nickname: e.target.value }))
            }
          />
          <CFormInput
            type="password"
            placeholder="password"
            className={styles.login__left__input}
            value={password}
            onChange={(e) =>
              setForm((state) => ({ ...state, password: e.target.value }))
            }
          />
          {!!data?.error && (
            <CAlert
              color="danger"
              className={styles.login__alert}
              variant="solid"
            >
              {data.error.message}
            </CAlert>
          )}
          <CButton type="submit" color="secondary" disabled={isLoading}>
            Sign In
          </CButton>
        </CForm>
      </div>
      <div className={styles.login__right}>
        <h1>
          {"Don't"} have a gaming account? <span></span>
        </h1>
        <h2>
          If you are new to blackjack you can go ahead and create a gaming
          account with your username/nickname and your secured password!
        </h2>
        <p>
          blackjack is an online gaming platform that allows users to play the
          blackjack game online. Users are allowed to have a one instance of a
          gaming engine, that they can play with their friends on the spare
          time.
        </p>
        <CButton
          type="button"
          color="secondary"
          onClick={() => router.push("/auth/register")}
        >
          Sign Up
        </CButton>
      </div>
    </div>
  );
};

export default Login;
