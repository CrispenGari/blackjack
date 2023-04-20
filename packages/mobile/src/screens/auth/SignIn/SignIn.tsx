import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, TOKEN_KEY } from "../../../constants";
import { styles } from "../../../styles";
import { AuthNavProps } from "../../../params";
import * as Animatable from "react-native-animatable";
import {
  CustomTextInput,
  Divider,
  DotCircular,
  Message,
} from "../../../components";
import { trpc } from "../../../utils/trpc";
import { useGamerStore } from "../../../store";
import { store } from "../../../utils";

const SignIn: React.FunctionComponent<AuthNavProps<"SignIn">> = ({
  navigation,
}) => {
  const [{ nickname, password }, setForm] = React.useState<{
    nickname: string;
    password: string;
  }>({
    nickname: "",
    password: "",
  });
  const { setGamer } = useGamerStore((state) => state);
  const { data, mutate, isLoading } = trpc.gamer.login.useMutation();
  const login = async () => {
    await mutate({ nickname, password, web: false });
  };

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!data?.gamer) {
      setGamer(data.gamer);
    }
    return () => {
      mounted = false;
    };
  }, [setGamer, data]);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted && !!data?.jwt) {
      (async () => {
        await store(TOKEN_KEY, data.jwt);
      })();
    }
    return () => {
      mounted = false;
    };
  }, [data]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.main, COLORS.secondary]}
        start={{
          x: 0,
          y: 1,
        }}
        end={{
          x: 0,
          y: 0,
        }}
        style={{ flex: 1 }}
      >
        <View
          style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={[
              styles.h1,
              {
                color: "white",
                fontSize: 25,
                letterSpacing: 1,
                marginBottom: 10,
              },
            ]}
          >
            blackjack
          </Text>
          <Animatable.Image
            animation={"bounce"}
            duration={2000}
            iterationCount={"infinite"}
            easing={"linear"}
            direction={"normal"}
            useNativeDriver={false}
            source={{
              uri: Image.resolveAssetSource(
                require("../../../../assets/logo.png")
              ).uri,
            }}
            style={{
              width: 100,
              height: 100,
              marginBottom: 10,
              resizeMode: "contain",
            }}
          />
          <Animatable.Text
            style={[
              styles.p,
              {
                marginVertical: 10,
                width: "90%",
                textAlign: "center",
                color: "white",
              },
            ]}
            animation={"zoomIn"}
            iterationCount={1}
            useNativeDriver={false}
          >
            Welcome back to the games!!.
          </Animatable.Text>
        </View>
        <KeyboardAvoidingView
          style={{
            flex: 0.5,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: 500,
            padding: 10,
            alignSelf: "center",
          }}
          behavior="padding"
          enabled
          keyboardVerticalOffset={10}
        >
          <CustomTextInput
            keyboardType="default"
            placeholder="nickname"
            inputStyle={{
              width: "100%",
              maxWidth: 500,
              fontSize: 20,
              paddingHorizontal: 15,
              paddingVertical: 10,
              marginBottom: 10,
            }}
            text={nickname}
            onChangeText={(text) =>
              setForm((state) => ({ ...state, nickname: text }))
            }
          />
          <CustomTextInput
            keyboardType="default"
            secureTextEntry={true}
            placeholder="password"
            inputStyle={{
              width: "100%",
              maxWidth: 500,
              fontSize: 20,
              paddingHorizontal: 15,
              paddingVertical: 10,
              marginBottom: 5,
            }}
            text={password}
            onChangeText={(text) =>
              setForm((state) => ({ ...state, password: text }))
            }
            onSubmitEditing={login}
          />
          {!!data?.error && <Message error message={data.error.message} />}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={login}
            style={[
              styles.button,
              {
                backgroundColor: COLORS.main,
                padding: 10,
                borderRadius: 5,
                alignSelf: "flex-start",
                marginTop: 10,
                maxWidth: 200,
              },
            ]}
          >
            <Text
              style={[
                styles.button__text,
                { color: COLORS.white, marginRight: isLoading ? 10 : 0 },
              ]}
            >
              Sign In
            </Text>
            {isLoading && <DotCircular color={COLORS.secondary} size={10} />}
          </TouchableOpacity>
          <Divider title="Don't have a gaming account?" />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("SignUp")}
            style={[
              styles.button,
              {
                backgroundColor: COLORS.secondary,
                padding: 10,
                borderRadius: 5,
                alignSelf: "flex-start",
                marginTop: 10,
                maxWidth: 200,
              },
            ]}
          >
            <Text style={[styles.button__text, { color: COLORS.white }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;
