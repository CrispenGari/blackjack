import React from "react";
import styles from "@/styles/Register.module.css";
import { CForm, CImage, CFormInput, CButton, CAlert } from "@coreui/react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { Loading } from "@/components";
import { useGamerStore } from "@/store";
interface Props {}
const Register: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { data: gamer } = trpc.gamer.gamer.useQuery();
  const { setGamer, gamer: g } = useGamerStore((state) => state);
  const [{ nickname, password, confirmPassword }, setForm] = React.useState<{
    nickname: string;
    password: string;
    confirmPassword: string;
  }>({ nickname: "", password: "", confirmPassword: "" });

  const { mutate, isLoading, data } = trpc.gamer.register.useMutation();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await mutate({
      confirmPassword,
      nickname,
      password,
      web: true,
    });
  };

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!g) {
      router.replace("/");
    }
    return () => {
      mounted = false;
    };
  }, [g, router]);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted) {
      setGamer(gamer?.gamer || null);
    }
    return () => {
      mounted = false;
    };
  }, [gamer, setGamer]);

  return (
    <div className={styles.register}>
      <div className={styles.register__left}>
        <CForm onSubmit={onSubmit}>
          <h1>blackjack</h1>
          <CImage src="/logo.png" alt="logo" />
          <h2>Hello World Welcome!!</h2>
          <CFormInput
            type="text"
            placeholder="nickname"
            className={styles.register__left__input}
            value={nickname}
            onChange={(e) =>
              setForm((state) => ({ ...state, nickname: e.target.value }))
            }
          />
          <CFormInput
            type="password"
            placeholder="password"
            className={styles.register__left__input}
            value={password}
            onChange={(e) =>
              setForm((state) => ({ ...state, password: e.target.value }))
            }
          />
          <CFormInput
            type="password"
            placeholder="confirm password"
            className={styles.register__left__input}
            value={confirmPassword}
            onChange={(e) =>
              setForm((state) => ({
                ...state,
                confirmPassword: e.target.value,
              }))
            }
          />
          {!!data?.error && (
            <CAlert
              color="danger"
              className={styles.register__alert}
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
      <div className={styles.register__right}>
        <h1>
          Already have a gaming account? <span></span>
        </h1>
        <h2>
          If you are a member of blackjack, we assume that you already know what
          the game is all about.
        </h2>

        <CButton
          type="button"
          color="secondary"
          onClick={() => router.push("/auth/login")}
        >
          Sign In
        </CButton>
      </div>
    </div>
  );
};

export default Register;
