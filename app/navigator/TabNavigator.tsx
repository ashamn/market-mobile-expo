import { FC } from "react";
import { StyleSheet } from "react-native";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import AppNavigator from "./AppNavigator";
import ProfileNavigator from "./ProfileNavigator";
import AntDesign from "@expo/vector-icons/AntDesign";
import NewListing from "@views/NewListing";

const Tab = createBottomTabNavigator();

interface Props {}

const getOptions = (iconName: string): BottomTabNavigationOptions => {
  return {
    tabBarIcon({ color, size }) {
      return <AntDesign name={iconName as any} size={size} color={color} />;
    },
  };
};

const TabNavigator: FC<Props> = (props) => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeNavigator"
        component={AppNavigator}
        options={getOptions("home")}
      ></Tab.Screen>
      <Tab.Screen
        name="NewListing"
        component={NewListing}
        options={getOptions("pluscircleo")}
      ></Tab.Screen>
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={getOptions("user")}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default TabNavigator;
