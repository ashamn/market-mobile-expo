import { runAxiosAsync } from "app/api/runAxiosAsync";
import client from "@api/client";
import { updateAuthState, getAuthState } from "@store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SignInRes } from "@views/Signin";
import { useDispatch, useSelector } from "react-redux";
import asyncStorage from "@utils/asyncStorage";
import { Keys } from "@utils/asyncStorage";

type UserInfo = {
  email: string;
  password: string;
};

const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector(getAuthState);
  const signIn = async (userInfo: UserInfo) => {
    dispatch(updateAuthState({ profile: null, pending: true }));
    const res = await runAxiosAsync<SignInRes>(
      client.post("/auth/sign-in", userInfo)
    );

    if (res) {
      await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
      await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);
      dispatch(
        updateAuthState({
          profile: { ...res.profile, accessToken: res.tokens.access },
          pending: false,
        })
      );
    } else {
      dispatch(updateAuthState({ profile: null, pending: false }));
    }
  };

  const loggedIn = !!authState.profile;

  return {
    signIn,
    authState,
    loggedIn,
  };
};

export default useAuth;
