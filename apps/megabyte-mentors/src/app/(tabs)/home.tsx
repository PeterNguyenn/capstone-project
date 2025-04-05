import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import EmptyState from '../../components/EmptyState'
import ApplicationItem from '../../components/ApplicationItem'
import { ApplicationRo } from '../../api/services/application.service'

const Home = () => {
  const data: any[] = [{_id: "1", studentName: 'Peter Nguyen', studentNumber: '2121212', campus: "HMC"}, {_id: "2", studentName: 'Peter Nguyen', studentNumber: '2121212', campus: "HMC"}];
  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({item}) => (
          <ApplicationItem
            _id={item._id}
            studentName={item.studentName}
            studentNumber={item.studentNumber}
            campus={item.campus}
          />
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

            <View className='w-full flex-1 pt-5'>
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