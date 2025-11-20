import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import EmptyState from '../../components/EmptyState'
import ApplicationItem from '../../components/ApplicationItem'
import { useApplications } from '../../api/individual-queries/applications/queries'
import { useGlobalContext } from '../../context/GlobalProvider'

const AdminHome = () => {
  const { user } = useGlobalContext();

  const { data: applications } = useApplications({})

  const totalApplications = applications?.data?.length || 0;
  const pendingApplications = applications?.data?.filter(app => app.status === 'pending').length || 0;
  const acceptedApplications = applications?.data?.filter(app => app.status === 'accepted').length || 0;
  const rejectedApplications = applications?.data?.filter(app => app.status === 'rejected').length || 0;

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={applications?.data}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({item}) => (
          <ApplicationItem
            _id={item._id}
            studentName={item.studentName}
            studentNumber={item.studentNumber}
            campus={item.campus}
            status={item.status}
          />
        )}
        ListHeaderComponent={() => (
          <View className='px-4 pb-4'>
            {/* Header Section */}
            <View className='bg-black-200 rounded-3xl p-6 mt-6 mb-6 shadow-lg'>
              <View className='flex-row justify-between items-start mb-4'>
                <View className='flex-1'>
                  <Text className='font-pregular text-base text-gray-100' testID='welcome'>Admin Dashboard</Text>
                  <Text className='text-3xl font-pbold text-white mt-1'>{user?.name}</Text>
                  <View className='bg-secondary px-3 py-1 rounded-full mt-3 self-start'>
                    <Text className='text-white text-sm font-pmedium capitalize'>
                      Administrator
                    </Text>
                  </View>
                </View>
                <View className='bg-black-100 p-3 rounded-2xl'>
                  <Image source={images.logoSmall} className='w-10 h-11' resizeMode='contain' />
                </View>
              </View>
            </View>

            {/* Stats Overview */}
            <View className='mb-6'>
              <Text className='text-white text-lg font-pbold mb-4'>Overview</Text>

              {/* First Row - Total and Pending */}
              <View className='flex-row gap-3 mb-3'>
                <View className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-secondary-200'>
                  <Text className='text-gray-100 text-sm font-pregular mb-1'>Total Applications</Text>
                  <Text className='text-white text-3xl font-pbold'>{totalApplications}</Text>
                </View>
                <View className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-yellow-500'>
                  <Text className='text-gray-100 text-sm font-pregular mb-1'>Pending</Text>
                  <Text className='text-white text-3xl font-pbold'>{pendingApplications}</Text>
                </View>
              </View>

              {/* Second Row - Accepted and Rejected */}
              <View className='flex-row gap-3'>
                <View className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-green-500'>
                  <Text className='text-gray-100 text-sm font-pregular mb-1'>Accepted</Text>
                  <Text className='text-white text-3xl font-pbold'>{acceptedApplications}</Text>
                </View>
                <View className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-red-500'>
                  <Text className='text-gray-100 text-sm font-pregular mb-1'>Rejected</Text>
                  <Text className='text-white text-3xl font-pbold'>{rejectedApplications}</Text>
                </View>
              </View>
            </View>

            {/* Section Title */}
            <View className='flex-row items-center justify-between mb-4'>
              <View>
                <Text className='text-white text-xl font-pbold'>All Applications</Text>
                <Text className='text-gray-100 text-sm font-pregular mt-1'>
                  Manage mentor applications
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No Applications Found'
            subtitle='No applications have been submitted yet'
          />
        )}
      />
    </SafeAreaView>
  )
}
export default AdminHome