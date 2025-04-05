import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import StatusChip from './StatusChip';
import { router } from 'expo-router';

type ApplicationItemProps = {
  _id: string;
  studentName: string;
  studentNumber: string;
  campus: string;
};

const ApplicationItem = (props: ApplicationItemProps) => {
  const { _id, studentName, studentNumber, campus } = props;
  return (
    <TouchableOpacity
      className="bg-card border-2 border-solid border-border rounded-xl shadow-md p-4 mb-4 mx-4"
      onPress={() => router.push(`/application-detail`)}
    >
      <View className="justify-between items-start flex-row">
        <View>
          <Text className="text-xl font-psemibold text-white">
            {studentName}
          </Text>
          <Text className="font-pmedium text-sm text-gray-100">
            {studentNumber}
          </Text>
          <Text className="font-pmedium text-sm text-gray-100">{campus}</Text>
        </View>
        <StatusChip status="pending" />
      </View>
    </TouchableOpacity>
  );
};

export default ApplicationItem;
