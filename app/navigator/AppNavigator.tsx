import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@views/Home";
import { FC } from "react";
import { StyleSheet } from "react-native";

export type AppStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator();

interface Props {}

const AppNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default AppNavigator;
