import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import { COLORS, FONTS, TOKEN_KEY } from "../../../constants";
import {
  CustomTextInput,
  DotCircular,
  Engine,
  EnginesHeader,
  JoinEngineBottomSheet,
  Loading,
} from "../../../components";
import { trpc } from "../../../utils/trpc";
import { useGamerStore } from "../../../store";
import { styles } from "../../../styles";
import { Engine as EngineType, Gamer } from "@blackjack/server";
import { del } from "../../../utils";
import { useMediaQuery } from "../../../hooks";

const Engines: React.FunctionComponent<AppNavProps<"Engines">> = ({
  navigation,
}) => {
  const { data, refetch, isLoading } = trpc.engine.engines.useQuery();
  const [engineToOpen, setEngineToOpen] = React.useState<
    EngineType | undefined
  >();
  const [openCreateEngineBottomSheet, setOpenCreateEngineBottomSheet] =
    React.useState<boolean>(false);
  trpc.engine.onEnginesStateChanged.useSubscription(undefined, {
    onData: async (data) => {
      await refetch();
    },
  });
  const {
    dimension: { height },
  } = useMediaQuery();
  const { mutateAsync, isLoading: signingOut } =
    trpc.gamer.logout.useMutation();
  const { setGamer } = useGamerStore((state) => state);
  const toggle = () => setEngineToOpen(undefined);
  const toggleCreateEngineBottomSheet = () =>
    setOpenCreateEngineBottomSheet((state) => !state);
  const logout = () => {
    mutateAsync().then(async (success) => {
      if (success) {
        await del(TOKEN_KEY);
        setGamer(null);
      }
    });
  };

  const [name, setName] = React.useState<string>("");

  const [engines, setEngines] = React.useState<
    Array<
      EngineType & {
        admin: Gamer;
      }
    >
  >(data?.engines || []);

  React.useEffect(() => {
    let mounted: boolean = true;
    if (mounted) {
      if (!!name) {
        setEngines((state) =>
          state.filter((engine) =>
            engine.name.toLowerCase().includes(name.trim().toLowerCase())
          )
        );
      } else {
        setEngines(data?.engines || []);
      }
    }
    return () => {
      mounted = false;
    };
  }, [name, data]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        height: 100,
        backgroundColor: COLORS.primary,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: "transparent",
        elevation: 0,
      },
      headerTitleStyle: {
        fontFamily: FONTS.extraBold,
        fontSize: 25,
        color: COLORS.white,
      },
      headerLeft: () => (
        <Image
          source={{
            uri: Image.resolveAssetSource(
              require("../../../../assets/logo.png")
            ).uri,
          }}
          style={{
            width: 50,
            height: 50,
            marginLeft: 10,
            resizeMode: "contain",
          }}
        />
      ),
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={logout}
          disabled={isLoading}
          style={[
            styles.button,
            {
              backgroundColor: COLORS.secondary,
              padding: 5,
              borderRadius: 5,
              marginRight: 5,
              maxWidth: 100,
            },
          ]}
        >
          <Text
            style={[
              styles.button__text,
              { color: COLORS.white, marginRight: signingOut ? 5 : 0 },
            ]}
          >
            Sign Out
          </Text>
          {signingOut && <DotCircular color={COLORS.main} size={10} />}
        </TouchableOpacity>
      ),
    });
  }, [navigation, signingOut]);

  return (
    <View style={{ flex: 1 }}>
      <EnginesHeader
        open={openCreateEngineBottomSheet}
        toggle={toggleCreateEngineBottomSheet}
      />
      {isLoading ? (
        <Loading loadedFont={true} bg={COLORS.secondary} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <CustomTextInput
            placeholder="filter engines..."
            inputStyle={{
              backgroundColor: COLORS.white,
              margin: 10,
              maxWidth: 500,
              width: "100%",
            }}
            text={name}
            onChangeText={(text) => setName(text)}
          />
          {data?.total === 0 ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <Text style={[styles.p, { padding: 30 }]}>
                No engines/game environment that are available yet. You can go
                ahead and create one.
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleCreateEngineBottomSheet}
                style={[
                  styles.button,
                  {
                    backgroundColor: COLORS.secondary,
                    padding: 5,
                    borderRadius: 5,
                    marginLeft: 10,
                  },
                ]}
              >
                <Text style={[styles.button__text, { color: COLORS.white }]}>
                  Create New Engine/Environment
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {engines.length === 0 ? (
                <Text
                  style={{
                    padding: 10,
                    textAlign: "center",
                    fontFamily: FONTS.regular,
                  }}
                >
                  No engines that matches filter {`"${name}"`}.
                </Text>
              ) : (
                engines.map((engine) => (
                  <Engine
                    key={engine.id}
                    engine={engine}
                    onPress={() => setEngineToOpen(engine)}
                  />
                ))
              )}
            </View>
          )}
          <View style={{ height: 200 }} />
        </ScrollView>
      )}

      {engineToOpen && (
        <JoinEngineBottomSheet
          navigation={navigation}
          engine={engineToOpen}
          toggle={toggle}
        />
      )}
    </View>
  );
};

export default Engines;
