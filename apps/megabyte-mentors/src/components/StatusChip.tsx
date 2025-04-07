import { View, Text } from 'react-native'
import React from 'react'

const StatusChip = (props: { status: string }) => {
  const { status } = props;

  const getStatusColor = () => {
    switch(status) {
      case 'accepted': return 'bg-status-accepted';
      case 'pending': return 'bg-status-pending';
      case 'rejected': return 'bg-status-rejected';
      default: return 'bg-status-pending';
    }
  };
  return (
    <View className={`rounded-3xl shadow-md ${getStatusColor()}`}>
      <Text className='text-clip font-psemibold text-primary px-3 py-1.5'>{status}</Text>
    </View>
  )
}

export default StatusChip;