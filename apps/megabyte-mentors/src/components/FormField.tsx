import { View, Text, TextInput, TouchableOpacity, Image, KeyboardTypeOptions } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  inputStyles,
  placeholder,
  ...props
}: {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  inputStyles?: string;
  keyboardType?: KeyboardTypeOptions;
  testID?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className={`w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center ${inputStyles}`}>
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
