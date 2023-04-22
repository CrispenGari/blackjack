export const engrokDomain: string = "0230-102-66-197-26.ngrok-free.app";

export const relativeTimeObject = {
  future: "in %s",
  past: "%s",
  s: "now",
  m: "1m",
  mm: "%dm",
  h: "1h",
  hh: "%dh",
  d: "1d",
  dd: "%dd",
  M: "1M",
  MM: "%dM",
  y: "1y",
  yy: "%dy",
};
export const TOKEN_KEY: string = "qid";
export const COLORS = {
  main: "#395144",
  primary: "#4e6c50",
  secondary: "#aa8b56",
  tertiary: "#f0ebce",
  white: "white",
  red: "#FF3953",
};
export const Fonts = {
  MuseoModernoItalic: require("../../assets/fonts/MuseoModerno-Italic.ttf"),
  MuseoModernoRegular: require("../../assets/fonts/MuseoModerno-Regular.ttf"),
  MuseoModernoBold: require("../../assets/fonts/MuseoModerno-Bold.ttf"),
  MuseoModernoBoldItalic: require("../../assets/fonts/MuseoModerno-BoldItalic.ttf"),
  MuseoModernoExtraBold: require("../../assets/fonts/MuseoModerno-ExtraBold.ttf"),
  MuseoModernoExtraBoldItalic: require("../../assets/fonts/MuseoModerno-ExtraBoldItalic.ttf"),
  MuseoModernoSemiBold: require("../../assets/fonts/MuseoModerno-SemiBold.ttf"),
  MuseoModernoSemiBoldItalic: require("../../assets/fonts/MuseoModerno-SemiBoldItalic.ttf"),
};

export const FONTS = {
  regular: "MuseoModernoRegular",
  italic: "MuseoModernoItalic",
  italicBold: "MuseoModernoBoldItalic",
  regularBold: "MuseoModernoBold",
  semiBold: "MuseoModernoSemiBold",
  semiBoldItalic: "MuseoModernoSemiBoldItalic",
  extraBold: "MuseoModernoExtraBold",
  extraBoldItalic: "MuseoModernoExtraBoldItalic",
};

export const BLACK_JACKS = [
  {
    id: "J_OF_CLUBS",
    name: "Jack Of Clubs",
    src: require("../../assets/cards/jacks/j_of_clubs.png"),
  },
  {
    id: "J_OF_SPADES",
    name: "Jack Of Spades",
    src: require("../../assets/cards/jacks/j_of_spades.png"),
  },
].sort(() => Math.random() - 0.5);

export const CARDS_BACK = [
  {
    id: "black",
    src: require("../../assets/cards/back/black.png"),
  },
  {
    id: "blue",
    src: require("../../assets/cards/back/blue.png"),
  },
  {
    id: "green",
    src: require("../../assets/cards/back/green.png"),
  },
  {
    id: "orange",
    src: require("../../assets/cards/back/orange.png"),
  },
  {
    id: "purple",
    src: require("../../assets/cards/back/purple.png"),
  },
  {
    id: "red",
    src: require("../../assets/cards/back/red.png"),
  },
].sort((_) => Math.random() - 0.5);

export const CARDS = [
  {
    src: require("../../assets/cards/png/a_of_hearts.png"),
    id: "A_OF_HEARTS",
    index: 0,
    value: "A",
  },
  {
    src: require("../../assets/cards/png/a_of_spades.png"),
    id: "A_OF_SPADES",
    index: 1,
    value: "A",
  },
  {
    src: require("../../assets/cards/png/a_of_diamonds.png"),
    id: "A_OF_DIAMONDS",
    index: 2,
    value: "A",
  },
  {
    src: require("../../assets/cards/png/a_of_clubs.png"),
    id: "A_OF_CLUBS",
    index: 3,
    value: "A",
  },
  {
    src: require("../../assets/cards/png/2_of_hearts.png"),
    id: "2_OF_HEARTS",
    index: 0,
    value: 2,
  },
  {
    src: require("../../assets/cards/png/2_of_spades.png"),
    id: "2_OF_SPADES",
    index: 1,
    value: 2,
  },
  {
    src: require("../../assets/cards/png/2_of_diamonds.png"),
    id: "2_OF_DIAMONDS",
    index: 2,
    value: 2,
  },
  {
    src: require("../../assets/cards/png/2_of_clubs.png"),
    id: "2_OF_CLUBS",
    index: 3,
    value: 2,
  },
  {
    src: require("../../assets/cards/png/3_of_hearts.png"),
    id: "3_OF_HEARTS",
    index: 0,
    value: 3,
  },
  {
    src: require("../../assets/cards/png/3_of_spades.png"),
    id: "3_OF_SPADES",
    index: 1,
    value: 3,
  },
  {
    src: require("../../assets/cards/png/3_of_diamonds.png"),
    id: "3_OF_DIAMONDS",
    index: 2,
    value: 3,
  },
  {
    src: require("../../assets/cards/png/3_of_clubs.png"),
    id: "3_OF_CLUBS",
    index: 3,
    value: 3,
  },
  {
    src: require("../../assets/cards/png/4_of_hearts.png"),
    id: "4_OF_HEARTS",
    index: 0,
    value: 4,
  },
  {
    src: require("../../assets/cards/png/4_of_spades.png"),
    id: "4_OF_SPADES",
    index: 1,
    value: 4,
  },
  {
    src: require("../../assets/cards/png/4_of_diamonds.png"),
    id: "4_OF_DIAMONDS",
    index: 2,
    value: 4,
  },
  {
    src: require("../../assets/cards/png/4_of_clubs.png"),
    id: "4_OF_CLUBS",
    index: 3,
    value: 4,
  },
  {
    src: require("../../assets/cards/png/5_of_hearts.png"),
    id: "5_OF_HEARTS",
    index: 0,
    value: 5,
  },
  {
    src: require("../../assets/cards/png/5_of_spades.png"),
    id: "5_OF_SPADES",
    index: 1,
    value: 5,
  },
  {
    src: require("../../assets/cards/png/5_of_diamonds.png"),
    id: "5_OF_DIAMONDS",
    index: 2,
    value: 5,
  },
  {
    src: require("../../assets/cards/png/5_of_clubs.png"),
    id: "5_OF_CLUBS",
    index: 3,
    value: 5,
  },
  {
    src: require("../../assets/cards/png/6_of_hearts.png"),
    id: "6_OF_HEARTS",
    index: 0,
    value: 6,
  },
  {
    src: require("../../assets/cards/png/6_of_spades.png"),
    id: "6_OF_SPADES",
    index: 1,
    value: 6,
  },
  {
    src: require("../../assets/cards/png/6_of_diamonds.png"),
    id: "6_OF_DIAMONDS",
    index: 2,
    value: 6,
  },
  {
    src: require("../../assets/cards/png/6_of_clubs.png"),
    id: "6_OF_CLUBS",
    index: 3,
    value: 6,
  },
  {
    src: require("../../assets/cards/png/7_of_hearts.png"),
    id: "7_OF_HEARTS",
    index: 0,
    value: 7,
  },
  {
    src: require("../../assets/cards/png/7_of_spades.png"),
    id: "7_OF_SPADES",
    index: 1,
    value: 7,
  },
  {
    src: require("../../assets/cards/png/7_of_diamonds.png"),
    id: "7_OF_DIAMONDS",
    index: 2,
    value: 7,
  },
  {
    src: require("../../assets/cards/png/7_of_clubs.png"),
    id: "7_OF_CLUBS",
    index: 3,
    value: 7,
  },
  {
    src: require("../../assets/cards/png/8_of_hearts.png"),
    id: "8_OF_HEARTS",
    index: 0,
    value: 8,
  },
  {
    src: require("../../assets/cards/png/8_of_spades.png"),
    id: "8_OF_SPADES",
    index: 1,
    value: 8,
  },
  {
    src: require("../../assets/cards/png/8_of_diamonds.png"),
    id: "8_OF_DIAMONDS",
    index: 2,
    value: 8,
  },
  {
    src: require("../../assets/cards/png/8_of_clubs.png"),
    id: "8_OF_CLUBS",
    index: 3,
    value: 8,
  },
  {
    src: require("../../assets/cards/png/9_of_hearts.png"),
    id: "9_OF_HEARTS",
    index: 0,
    value: 9,
  },
  {
    src: require("../../assets/cards/png/9_of_spades.png"),
    id: "9_OF_SPADES",
    index: 1,
    value: 9,
  },
  {
    src: require("../../assets/cards/png/9_of_diamonds.png"),
    id: "9_OF_DIAMONDS",
    index: 2,
    value: 9,
  },
  {
    src: require("../../assets/cards/png/9_of_clubs.png"),
    id: "9_OF_CLUBS",
    index: 3,
    value: 9,
  },
  {
    src: require("../../assets/cards/png/10_of_hearts.png"),
    id: "10_OF_HEARTS",
    index: 0,
    value: 10,
  },
  {
    src: require("../../assets/cards/png/10_of_spades.png"),
    id: "10_OF_SPADES",
    index: 1,
    value: 10,
  },
  {
    src: require("../../assets/cards/png/10_of_diamonds.png"),
    id: "10_OF_DIAMONDS",
    index: 2,
    value: 10,
  },
  {
    src: require("../../assets/cards/png/10_of_clubs.png"),
    id: "10_OF_CLUBS",
    index: 3,
    value: 10,
  },
  {
    src: require("../../assets/cards/png/k_of_hearts.png"),
    id: "K_OF_HEARTS",
    index: 0,
    value: "K",
  },
  {
    src: require("../../assets/cards/png/k_of_spades.png"),
    id: "K_OF_SPADES",
    index: 1,
    value: "K",
  },
  {
    src: require("../../assets/cards/png/k_of_diamonds.png"),
    id: "K_OF_DIAMONDS",
    index: 2,
    value: "K",
  },
  {
    src: require("../../assets/cards/png/k_of_clubs.png"),
    id: "K_OF_CLUBS",
    index: 3,
    value: "K",
  },
  {
    src: require("../../assets/cards/png/q_of_hearts.png"),
    id: "Q_OF_HEARTS",
    index: 0,
    value: "Q",
  },
  {
    src: require("../../assets/cards/png/q_of_spades.png"),
    id: "Q_OF_SPADES",
    index: 1,
    value: "Q",
  },
  {
    src: require("../../assets/cards/png/q_of_diamonds.png"),
    id: "Q_OF_DIAMONDS",
    index: 2,
    value: "Q",
  },
  {
    src: require("../../assets/cards/png/q_of_clubs.png"),
    id: "Q_OF_CLUBS",
    index: 3,
    value: "Q",
  },
  {
    src: require("../../assets/cards/png/j_of_hearts.png"),
    id: "J_OF_HEARTS",
    index: 0,
    value: "J",
  },
  {
    src: require("../../assets/cards/png/j_of_spades.png"),
    id: "J_OF_SPADES",
    index: 1,
    value: "J",
  },
  {
    src: require("../../assets/cards/png/j_of_diamonds.png"),
    id: "J_OF_DIAMONDS",
    index: 2,
    value: "J",
  },
  {
    src: require("../../assets/cards/png/j_of_clubs.png"),
    id: "J_OF_CLUBS",
    index: 3,
    value: "J",
  },
  {
    src: require("../../assets/cards/png/black_jockey.png"),
    id: "BLACK_JOCKEY",
    index: 1,
    value: "JOCKEY",
  },
  {
    src: require("../../assets/cards/png/red_jockey.png"),
    id: "RED_JOCKEY",
    index: 2,
    value: "JOCKEY",
  },
];
