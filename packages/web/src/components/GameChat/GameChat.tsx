import React from "react";
import styles from "./GameChat.module.css";
import { CForm, CFormInput, CButton } from "@coreui/react";
import { trpc } from "@/utils/trpc";
import { Engine, Gamer, Message } from "@blackjack/server";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { useGamerStore } from "@/store";
import { relativeTimeObject } from "@/constants";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
interface Props {
  engine: Engine & {
    messages: (Message & {
      sender: Gamer;
    })[];
  };
}
const GameChat: React.FC<Props> = ({ engine }) => {
  const [message, setMessage] = React.useState<string>("");
  const scrollRef = React.useRef<HTMLDivElement | undefined>();
  const {
    isLoading,
    data: messages,
    refetch,
  } = trpc.message.messages.useQuery({
    engineId: engine.id,
  });
  trpc.message.onNewMessage.useSubscription(
    { engineId: engine.id },
    {
      onData: async (data) => {
        await refetch();
        if (scrollRef?.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight + 100,
            behavior: "smooth",
          });
        }
      },
    }
  );
  const { isLoading: sending, mutate: mutateSendMessage } =
    trpc.message.sendMessage.useMutation();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!!!message.trim()) return;
    await mutateSendMessage({
      engineId: engine.id,
      message,
    });
    setMessage("");
  };

  return (
    <div className={styles.game__chat}>
      <div className={styles.game__chat__header}>
        <h1>Chat</h1>
        <p>{engine.gamersIds.length || 0} gamers in the chat.</p>
      </div>
      <div className={styles.game__chat__main} ref={scrollRef as any}>
        {isLoading && <p>loading...</p>}
        {messages?.messages.length === 0 ? (
          <p>no messages</p>
        ) : (
          messages?.messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))
        )}
      </div>
      <CForm onSubmit={onSubmit}>
        <CFormInput
          type="text"
          placeholder="type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <CButton type="submit" disabled={!!!message.trim() || sending}>
          Send
        </CButton>
      </CForm>
    </div>
  );
};

export default GameChat;

const MessageComponent: React.FunctionComponent<{
  message: Message & {
    sender: Gamer;
  };
}> = ({ message }) => {
  const { gamer } = useGamerStore((s) => s);
  return (
    <div
      className={
        gamer?.id === message.senderId
          ? styles.game__chat__main__message__me
          : styles.game__chat__main__message
      }
    >
      <p>{message.message}</p>
      <p>
        {dayjs(message.createdAt).fromNow()} •{" "}
        {gamer?.id === message.senderId ? "you" : message.sender.nickname}
      </p>
    </div>
  );
};
