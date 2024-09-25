import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword from "@views/ForgotPassword";
import Signin from "@views/Signin";
import Signup from "@views/Signup";
import { FC } from "react";
import { StyleSheet } from "react-native";

export type AuthStackParamList = {
  Signin: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator();

interface Props {}

const AuthNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Signin"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default AuthNavigator;
