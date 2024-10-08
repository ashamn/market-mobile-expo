import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";
import Navigator from "@navigator/index";
import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";
import store from "@store/index";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <Navigator />
        <FlashMessage position="top" />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
