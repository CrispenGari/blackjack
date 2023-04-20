import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import { COLORS } from "../../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { AuthNavProps } from "../../../params";
import * as Animatable from "react-native-animatable";
import { BottomSheet } from "react-native-btr";
import { styles } from "../../../styles";
const Landing: React.FunctionComponent<AuthNavProps<"Landing">> = ({
  navigation,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const toggle = () => setOpen((state) => !state);
  return (
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
        style={{ flex: 0.7, justifyContent: "center", alignItems: "center" }}
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
          Welcome to blackjack your online stress relief platform where you can
          join and play games with your friends remotely, by simply joining your
          favorite game engine.
        </Animatable.Text>
      </View>
      <View
        style={{ justifyContent: "center", alignItems: "center", flex: 0.4 }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggle}
          style={[
            styles.button,
            {
              backgroundColor: COLORS.main,
            },
          ]}
        >
          <Text style={[styles.button__text, { color: COLORS.white }]}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        visible={open}
        onBackButtonPress={toggle}
        onBackdropPress={toggle}
      >
        <SafeAreaView
          style={{
            backgroundColor: COLORS.primary,
            height: 250,
            justifyContent: "center",
            alignItems: "center",
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.replace("SignIn")}
            style={[
              styles.button,
              {
                backgroundColor: COLORS.main,
                marginBottom: 15,
              },
            ]}
          >
            <Text style={[styles.button__text, { color: COLORS.white }]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.replace("SignUp")}
            style={[
              styles.button,
              {
                backgroundColor: COLORS.secondary,
              },
            ]}
          >
            <Text style={[styles.button__text, { color: COLORS.white }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </BottomSheet>
    </LinearGradient>
  );
};

export default Landing;
