import { FC } from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "@utils/colors";

interface Props {
  icon: JSX.Element;
  name: string;
}

const CategoryOptions: FC<Props> = ({ icon, name }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ transform: [{ scale: 0.5 }] }}>{icon}</View>
      <Text style={styles.catgeory}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  catgeory: {
    color: colors.primary,
    paddingVertical: 10,
  },
});

export default CategoryOptions;
