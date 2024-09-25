import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import colors from "@utils/colors";
import { FC, useEffect, useState } from "react";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import { useDispatch, useSelector } from "react-redux";
import { getAuthState, Profile, updateAuthState } from "@store/auth";
import client from "@api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { runAxiosAsync } from "@api/runAxiosAsync";
import LoadingSpinner from "@ui/LoadingSpinner";
import { Text } from "react-native";
import useAuth from "@hooks/useAuth";
import TabNavigator from "./TabNavigator";
import useClient from "@hooks/useClient";
import asyncStorage, { Keys } from "@utils/asyncStorage";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

interface Props {}

const Navigator: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { authState, loggedIn } = useAuth();
  const { authClient } = useClient();

  const fetchAuthState = async () => {
    const token = await asyncStorage.get(Keys.AUTH_TOKEN);
    if (token) {
      dispatch(updateAuthState({ profile: null, pending: true }));
      const res = await runAxiosAsync<{ profile: Profile }>(
        authClient.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      if (res) {
        dispatch(updateAuthState({ profile: res.profile, pending: false }));
      } else {
        dispatch(updateAuthState({ profile: null, pending: false }));
      }
    }
  };
  useEffect(() => {
    fetchAuthState();
  }, []);

  return (
    <NavigationContainer theme={MyTheme}>
      <LoadingSpinner visible={authState.pending} />

      {!loggedIn ? <AuthNavigator /> : <TabNavigator />}
    </NavigationContainer>
  );
};

export default Navigator;
