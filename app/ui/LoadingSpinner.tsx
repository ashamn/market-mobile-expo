import colors from "@utils/colors";
import LottieView from "lottie-react-native";
import { FC } from "react";
import { View, StyleSheet, Modal, Text } from "react-native";

interface Props {
  visible: boolean;
}

const LoadingSpinner: FC<Props> = ({ visible }) => {
  if (!visible) return null;
  return (
    <Modal animationType="fade" transparent>
      <View style={styles.container}>
        <LottieView
          source={require("../../assets/loading.json")}
          autoPlay
          loop
          style={styles.lotteView}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backDrop,
  },
  lotteView: {
    flex: 1,
    transform: [{ scale: 0.2 }],
  },
});

export default LoadingSpinner;
