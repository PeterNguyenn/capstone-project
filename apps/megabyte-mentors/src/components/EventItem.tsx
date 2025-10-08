import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import CapacityChip from './CapacityChip';

type EventItemProps = {
  _id: string;
  title: string;
  date: string;
  capacity: number;
  attendeesCount: number;
  campus: string;
};

const EventItem = (props: EventItemProps) => {
  const { _id, capacity, title, date, campus, attendeesCount } = props;
  return (
    <TouchableOpacity
      className="bg-card border-2 border-solid border-border rounded-xl shadow-md p-4 mb-4 mx-4"
      onPress={() => router.push(`/event-detail/${_id}`)}
    >
      <View className="justify-between items-start flex-row">
        <View>
          <Text className="text-xl font-psemibold text-white">
            {title}
          </Text>
          <Text className="font-pmedium text-sm text-gray-100">
            {new Date(date).getDate()} {new Date(date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
          </Text>
          <Text className="font-pmedium text-sm text-gray-100">{campus}</Text>
        </View>
        <CapacityChip capacity={capacity} attendeesCount={attendeesCount}/>
      </View>
    </TouchableOpacity>
  );
};

export default EventItem;
