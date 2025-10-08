import { View, Text } from 'react-native'
import React from 'react'

const CapacityChip = (props: { capacity: number, attendeesCount: number }) => {
  const { capacity, attendeesCount } = props;

  const statusColor = attendeesCount >= capacity ? 'bg-status-accepted' : 'bg-status-pending';

  return (
    <View className={`rounded-3xl shadow-md ${statusColor}`}>
      <Text className='text-clip font-psemibold text-primary px-3 py-1.5'>{`${attendeesCount} / ${capacity}`}</Text>
    </View>
  )
}

export default CapacityChip;