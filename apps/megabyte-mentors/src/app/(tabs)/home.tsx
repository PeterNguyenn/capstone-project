import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import EmptyState from '../../components/EmptyState'

interface Item {
  id: number;
  name?: string;
}

const Home = () => {
  const data: Item[] = [];
  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <Text className='text-3xl text-white'>{item?.id ? item.name || `Item ${item.id}` : null}</Text>
        )}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start flex-row mb-6'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100' testID='welcome'>Welcome Back!</Text>
                <Text className='text-2xl font-psemibold text-white'>Peter</Text>
              </View>
              <View className='mt-1.5'>
                <Image source={images.logoSmall} className='w-9 h-10' resizeMode='contain' />
              </View>
            </View>

            <View className='w-full flex-1 pt-5 pb-8'>
              <Text className='text-gray-100 text-lg font-pregular mb-3'>Applications</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No Applications Found'
            subtitle='Be the first to apply to become a mentor'
            redirectPath='/application'
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Home