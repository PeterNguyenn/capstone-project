import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

const CustomButton = ({
  title,
  handlePress,
  containerStyle,
  textStyle,
  isLoading,
  ...props
}: {
  title: string;
  handlePress: () => void;
  containerStyle?: string;
  textStyle?: string;
  isLoading?: boolean;
  testID?: string;
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary min-h-[62px] rounded-xl justify-center items-center ${containerStyle}`}
      disabled={isLoading}
      {...props}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyle}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
