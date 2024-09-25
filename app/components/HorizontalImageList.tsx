import { FC } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";

interface Props {
  images: string[];
  onPress?(item: string): void;
  onLongPress?(item: string): void;
  style?: StyleProp<ViewStyle>;
}

const HorizontalImageList: FC<Props> = ({
  images,
  onLongPress,
  onPress,
  style,
}) => {
  return (
    <FlatList
      data={images}
      contentContainerStyle={style}
      renderItem={({ item }) => {
        return (
          <Pressable
            style={styles.listItem}
            onPress={() => {
              onPress && onPress(item);
            }}
            onLongPress={() => {
              onLongPress && onLongPress(item);
            }}
          >
            <Image style={styles.image} source={{ uri: item }} />
          </Pressable>
        );
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5,
    overflow: "hidden",
  },
  image: {
    flex: 1,
  },
});

export default HorizontalImageList;
