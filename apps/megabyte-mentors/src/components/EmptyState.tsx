import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton';
import { router } from 'expo-router';

const EmptyState = ({ title, subtitle, redirectPath }: { title: string; subtitle: string, redirectPath?: string }) => {
  return (
    <View className='justify-center items-center px-4'>
      <Image source={images.empty} className='w-[270px] h-[215px]' resizeMode='contain' />
      <Text className='text-xl font-psemibold text-white mt-2'>{title}</Text>
      <Text className='font-pmedium text-sm text-gray-100'>{subtitle}</Text>

      <CustomButton title='Apply Now' handlePress={() => router.push(redirectPath ? redirectPath : '/home')} containerStyle='my-6 w-full' />
    </View>
  )
}

export default EmptyState