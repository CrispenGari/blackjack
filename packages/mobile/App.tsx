import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { LogBox, View, StatusBar } from "react-native";
import TRPCProvider from "./src/providers/TRPCProvider";
import Routes from "./src/routes/Routes";
import { useFonts } from "expo-font";
import { COLORS, FONTS, Fonts } from "./src/constants";
import { Loading } from "./src/components";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

LogBox.ignoreLogs;
LogBox.ignoreAllLogs();

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: COLORS.secondary,
        width: "100%",
        maxWidth: 500,
      }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      text1Style={{
        fontSize: 20,
        fontFamily: FONTS.regularBold,
        color: COLORS.white,
      }}
      text2Style={{
        fontSize: 16,
        fontFamily: FONTS.regular,
        color: COLORS.white,
      }}
    />
  ),
};
const App = () => {
  const [loaded] = useFonts(Fonts);
  if (!loaded) return <Loading loadedFont={loaded} />;
  return (
    <>
      <TRPCProvider>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle={"light-content"} />
          <Routes />
        </View>
      </TRPCProvider>
      <Toast config={toastConfig} />
    </>
  );
};

registerRootComponent(App);
