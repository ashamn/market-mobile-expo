import AppButton from "@ui/AppButton";
import CustomkeyAvoidingView from "@ui/CustomkeyAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "@navigator/AuthNavigator";
import { emailRegex } from "@utils/validator";
import { showMessage } from "react-native-flash-message";
import client from "@api/client";
import { runAxiosAsync } from "@api/runAxiosAsync";

interface Props {}

const ForgotPassword: FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      return showMessage({ message: "Invalid email id!", type: "danger" });
    }
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/forget-pass", { email })
    );

    setBusy(false);
    if (res) {
      showMessage({ message: res.message, type: "success" });
    }
  };

  return (
    <CustomkeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          <AppButton
            active={!busy}
            title={busy ? "Please wait" : "Request Link"}
            onPress={handleSubmit}
          />
          <FormDivider />
          <FormNavigator
            leftTitle="Sign Up"
            rightTitle="Sign In"
            onLeftPress={() => {
              navigate("Signup");
            }}
            onRightPress={() => {
              navigate("Signin");
            }}
          />
        </View>
      </View>
    </CustomkeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 15,
    flex: 1,
  },
  formContainer: {
    marginTop: 30,
  },
});

export default ForgotPassword;
