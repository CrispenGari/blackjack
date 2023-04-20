import { createStackNavigator } from "@react-navigation/stack";
import { AuthParamList } from "../../params";
import { Landing, SignUp, SignIn } from "../../screens/auth";

const Stack = createStackNavigator<AuthParamList>();
const Auth = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  );
};

export default Auth;
