export const BLACK_JACKS = [
  { id: "J_OF_CLUBS", name: "Jack Of Clubs" },
  { id: "J_OF_SPADES", name: "Jack Of Spades" },
].sort(() => Math.random() - 0.5);

export const CARDS_BACK = [
  {
    id: "black",
    src: "/cards/back/black.png",
  },
  {
    id: "blue",
    src: "/cards/back/blue.png",
  },
  {
    id: "green",
    src: "/cards/back/green.png",
  },
  {
    id: "orange",
    src: "/cards/back/orange.png",
  },
  {
    id: "purple",
    src: "/cards/back/purple.png",
  },
  {
    id: "red",
    src: "/cards/back/red.png",
  },
].sort((_) => Math.random() - 0.5);
