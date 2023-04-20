export const engrokDomain: string = "6cbe-213-172-135-189.ngrok-free.app";

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
  { id: "J_OF_CLUBS", name: "Jack Of Clubs" },
  { id: "J_OF_SPADES", name: "Jack Of Spades" },
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
