import colors from "@utils/colors";
import { FC } from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Text,
  Pressable,
} from "react-native";

interface Props<T> {
  visible: boolean;
  onRequestClose(state: boolean): void;
  options: T[];
  renderItem(item: T): JSX.Element;
  onPressItem(item: T): void;
}

const OptionModal = <T extends unknown>({
  visible,
  onRequestClose,
  options,
  renderItem,
  onPressItem,
}: Props<T>) => {
  const handleClose = () => onRequestClose(!visible);
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={() => onRequestClose(!visible)}
    >
      <Pressable onPress={handleClose} style={styles.container}>
        <View style={styles.innerContainer}>
          <ScrollView>
            {options.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    onPressItem(item);
                    handleClose();
                  }}
                >
                  {renderItem(item)}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: colors.backDrop,
  },
  innerContainer: {
    width: "100%",
    backgroundColor: colors.inactive,
    padding: 10,
    borderRadius: 7,
    maxHeight: 200,
  },
});

export default OptionModal;
