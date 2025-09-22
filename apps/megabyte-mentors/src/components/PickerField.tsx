import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardTypeOptions,
} from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';
import { Picker } from '@react-native-picker/picker';
import { SelectList } from 'react-native-dropdown-select-list';

const PickerField = ({
  title,
  // value,
  handleChangeText,
  otherStyles,
  placeholder,
  data,
  ...props
}: {
  title: string;
  // value: string;
  placeholder?: string;
  data: Array<{ key: string; label: string; value: string }>;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
  testID?: string;
}) => {
  const [selectedValue, setSelectedValue] = useState('option1');

  return (
    <View className={`space-y-2 ${otherStyles}`} testID={props.testID}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <SelectList
        data={data}
        setSelected={handleChangeText}
        boxStyles={{
          borderWidth: 2,
          borderColor: '#232533',
          backgroundColor: '#1E1E2D',
          borderRadius: 16,
          height: 60,
          alignContent: 'center',
          alignItems: 'center',
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
        placeholder={"Select"}
        {...props}
      />
    </View>
  );
};

export default PickerField;
