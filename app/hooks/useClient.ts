import axios from "axios";
import { API_URL } from "@api/server";
import useAuth from "./useAuth";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import { runAxiosAsync } from "@api/runAxiosAsync";
import { useDispatch } from "react-redux";
import { updateAuthState } from "@store/auth";

const authClient = axios.create({ baseURL: API_URL });

type Response = {
  tokens: {
    refresh: string;
    access: string;
  };
};

const useClient = () => {
  const { authState } = useAuth();
  const dispatch = useDispatch();
  const token = authState.profile?.accessToken;
  authClient.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshAuthLogic = async (failedRequest: any) => {
    const refreshToken = await AsyncStorage.getItem(Keys.REFRESH_TOKEN);
    const options = {
      methods: "POST",
      data: { refreshToken },
      url: `${API_URL}/auth/refresh-token`,
    };
    const res = await runAxiosAsync<Response>(axios(options));
    if (res?.tokens) {
      failedRequest.reponse.config.headers.Authorization = `Bearer ${res.tokens.access}`;
      await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
      await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);
      dispatch(
        updateAuthState({
          profile: { ...authState.profile!, accessToken: res.tokens.access },
          pending: false,
        })
      );
    }
    return Promise.resolve();
  };

  createAuthRefreshInterceptor(authClient, refreshAuthLogic);
  return {
    authClient,
  };
};

export default useClient;
