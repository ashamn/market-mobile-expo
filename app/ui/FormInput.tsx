import { FC, useState } from "react";
import { View, StyleSheet, TextInput, TextInputProps } from "react-native";
import colors from "@utils/colors";

interface Props extends TextInputProps {}

const FormInput: FC<Props> = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[
        styles.input,
        isFocused ? styles.borderActive : styles.borderInactive,
      ]}
      placeholderTextColor={colors.primary}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 5,
    marginBottom: 15,
    color: colors.primary,
    borderWidth: 1,
  },
  borderInactive: {
    borderWidth: 1,
    borderColor: colors.inactive,
  },
  borderActive: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
});

export default FormInput;
