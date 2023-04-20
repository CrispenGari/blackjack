import { createStackNavigator } from "@react-navigation/stack";
import { AppParamList } from "../../params";
import { Engines, Chat, Engine } from "../../screens/game";

const Stack = createStackNavigator<AppParamList>();
const Game = () => {
  return (
    <Stack.Navigator
      initialRouteName="Engines"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Engines" component={Engines} />
      <Stack.Screen name="Engine" component={Engine} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

export default Game;
