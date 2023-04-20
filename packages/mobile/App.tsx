import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { LogBox, View, StatusBar } from "react-native";
import TRPCProvider from "./src/providers/TRPCProvider";
import Routes from "./src/routes/Routes";
import { useFonts } from "expo-font";
import { Fonts } from "./src/constants";
import { Loading } from "./src/components";
LogBox.ignoreLogs;
LogBox.ignoreAllLogs();

const App = () => {
  const [loaded] = useFonts(Fonts);
  if (!loaded) return <Loading loadedFont={loaded} />;
  return (
    <TRPCProvider>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle={"light-content"} />
        <Routes />
      </View>
    </TRPCProvider>
  );
};

registerRootComponent(App);
