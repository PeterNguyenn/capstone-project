import { View, Text, TextInput, TouchableOpacity, Image, KeyboardTypeOptions } from 'react-native';
import React, { Key, useState } from 'react';
import { icons } from '../constants';

const FormField = ({
  title,
  value,
  onChange,
  otherStyles,
  placeholder,
  keyboardType,
}: {
  title: string;
  value: string;
  placeholder?: string;
  onChange: (text: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-medium">{title}</Text>
      <View className="w-full border-2 border-red-500 h-16 px-4 rounded-2xl focus:border-secondary items-center flex-row justify-between">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          onChangeText={onChange}
          placeholderTextColor='#7b7b8b'
          placeholder={placeholder}
          secureTextEntry={title === 'Password' && !showPassword}
          keyboardType={keyboardType ?? 'default'}
        />
        {title === 'Password' && (
          <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          >
            <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-6 h-6" resizeMode='contain' />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
