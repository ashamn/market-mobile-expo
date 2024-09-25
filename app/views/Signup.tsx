import AppButton from "@ui/AppButton";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomkeyAvoidingView from "@ui/CustomkeyAvoidingView";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "@navigator/AuthNavigator";
import axios from "axios";
import { newUserSchema, yupValidate } from "@utils/validator";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import { API_URL } from "@api/server";
import client from "@api/client";
import { SignInRes } from "@views/Signin";
import useAuth from "app/hooks/useAuth";

interface Props {}

const Signup: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const [busy, setBusy] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = userInfo;
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(newUserSchema, userInfo);
    if (error) {
      return showMessage({
        message: error,
        type: "danger",
      });
    }

    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/sign-up", values)
    );

    if (res?.message) {
      showMessage({ message: res.message, type: "success" });
      signIn(values!);
    }
    setBusy(false);
  };

  const handleChange = (name: string) => (text: string) => {
    setUserInfo({ ...userInfo, [name]: text });
  };

  return (
    <CustomkeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Name"
            value={name}
            onChangeText={handleChange("name")}
          />
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleChange("email")}
          />
          <FormInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={handleChange("password")}
          />
          <AppButton active={!busy} title="Sign up" onPress={handleSubmit} />
          <FormDivider />
          <FormNavigator
            leftTitle="Forget Password"
            rightTitle="Sign In"
            onLeftPress={() => {
              navigate("ForgotPassword");
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

export default Signup;
