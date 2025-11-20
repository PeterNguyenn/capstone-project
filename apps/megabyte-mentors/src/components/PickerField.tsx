import {
  View,
  Text,
  Image,
} from 'react-native';
import React, { useMemo } from 'react';
import { icons } from '../constants';
import { SelectList } from 'react-native-dropdown-select-list';

interface PickerOption {
  key: string;
  label: string;
  value: string;
}

interface PickerFieldProps {
  title: string;
  value?: string;
  placeholder?: string;
  data: PickerOption[];
  handleChangeText: (value: string) => void;
  otherStyles?: string;
  testID?: string;
  disabled?: boolean;
}

const PickerField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder = "Select",
  data,
  disabled = false,
  ...props
}: PickerFieldProps) => {
  // Memoize the default option to avoid recalculating on every render
  const defaultOption = useMemo(() => {
    if (!value) return undefined;
    return data.find(item => item.value === value);
  }, [value, data]);

  return (
    <View className={`space-y-2 ${otherStyles}`} testID={props.testID}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View pointerEvents={disabled ? 'none' : 'auto'}>
        <SelectList
          data={data}
          setSelected={handleChangeText}
          defaultOption={defaultOption}
          boxStyles={{
            borderWidth: 2,
            borderColor: '#232533',
            backgroundColor: disabled ? '#161622' : '#1E1E2D',
            borderRadius: 16,
            height: 60,
            alignContent: 'center',
            alignItems: 'center',
            opacity: disabled ? 0.5 : 1,
          }}
          inputStyles={{
            color: '#FFFFFF',
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
          }}
          dropdownStyles={{
            backgroundColor: '#161622',
            borderRadius: 16,
          }}
          dropdownTextStyles={{
            color: '#7B7B8B',
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
          }}
          searchicon={<Image source={icons.search} className="w-5 h-5 mr-2" />}
          placeholder={placeholder}
          {...props}
        />
      </View>
    </View>
  );
};

export default PickerField;
