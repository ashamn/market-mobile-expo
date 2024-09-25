import AppButton from "@ui/AppButton";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomkeyAvoidingView from "@ui/CustomkeyAvoidingView";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@navigator/AuthNavigator";
import axios from "axios";
import { yupValidate, signInSchema } from "@utils/validator";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import { API_URL } from "@api/server";
import client from "@api/client";
import { useDispatch } from "react-redux";
import { updateAuthState } from "@store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "app/hooks/useAuth";

interface Props {}

export interface SignInRes {
  profile: {
    id: any;
    email: string;
    name: string;
    verified: boolean;
    avatar?: string;
  };
  tokens: {
    refresh: string;
    access: string;
  };
}

const SignIn: FC<Props> = (props) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const { email, password } = userInfo;
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(signInSchema, userInfo);
    if (error) {
      return showMessage({
        message: error,
        type: "danger",
      });
    }

    if (values) signIn(values);
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
          <AppButton title="Sign In" onPress={handleSubmit} />
          <FormDivider />
          <FormNavigator
            leftTitle="Forget Password"
            rightTitle="Sign Up"
            onLeftPress={() => {
              navigate("ForgotPassword");
            }}
            onRightPress={() => {
              navigate("Signup");
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

export default SignIn;
