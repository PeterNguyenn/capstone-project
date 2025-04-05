import { View, Text } from 'react-native'
import React from 'react'

const StatusChip = (props: { status: string }) => {
  const { status } = props;

  return (
    <View className={`bg-status-${status} rounded-3xl shadow-md`}>
      <Text className='text-clip font-psemibold text-primary px-3 py-1.5'>{status}</Text>
    </View>
  )
}

export default StatusChip;