import Constants from "expo-constants";
const { expoConfig } = Constants;

const server = () => {
  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const port = process.env.EXPO_PUBLIC_API_PORT;
  let serverUrl = "";

  switch (environment) {
    case "dev":
      {
        if (apiUrl) serverUrl = `http://${apiUrl}:${port}`;

        const hostUri = expoConfig?.hostUri;
        if (!hostUri) return "";
        const url = hostUri.split(":")[0];
        serverUrl = `http://${url}:${port}`;
      }
      break;
    default: {
      serverUrl = `https://${apiUrl}`;
    }
  }
  return serverUrl;
};

export const API_URL = server();
