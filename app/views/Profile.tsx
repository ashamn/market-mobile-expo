import AvatarView from "@ui/AvatarView";
import { FC } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

interface Props {}

const Profile: FC<Props> = (props) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile image and profile info */}
      <AvatarView size={80} />
      {/* Options for profile */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Profile;
