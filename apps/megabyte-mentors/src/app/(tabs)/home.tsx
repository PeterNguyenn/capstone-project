import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import EmptyState from '../../components/EmptyState'
import ApplicationItem from '../../components/ApplicationItem'
import { useApplications } from '../../api/individual-queries/applications/queries'
import { useGlobalContext } from '../../context/GlobalProvider'
import { useEvents } from '../../api/individual-queries/event/queries'
import EventItem from '../../components/EventItem'

const Home = () => {
  const { user } = useGlobalContext();

  const { data: applications } = useApplications(
   user?.role !== 'admin' && user?._id ? {
      userId: user._id,
    } : {}
  )

  const { data: events } = useEvents({ upcoming: true}, user?.role === 'mentor');

  const pendingApplications = applications?.data?.filter(app => app.status === 'pending').length || 0;
  const acceptedApplications = applications?.data?.filter(app => app.status === 'accepted').length || 0;
  const upcomingEventsCount = events?.data?.length || 0;

  return (
    <SafeAreaView className='bg-primary h-full'>
      {user?.role === 'mentor' ? (
        <FlatList
          data={events?.data}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({item}) => (
            <EventItem
              _id={item._id}
              title={item.title}
              date={item.date}
              campus={item.campus}
              capacity={item.capacity}
              attendeesCount={item.attendeesCount}
            />
          )}
          ListHeaderComponent={() => (
            <View className='px-4 pb-4'>
              {/* Header Section */}
              <View className='bg-black-200 rounded-3xl p-6 mt-6 mb-6 shadow-lg'>
                <View className='flex-row justify-between items-start mb-4'>
                  <View className='flex-1'>
                    <Text className='font-pregular text-base text-gray-100' testID='welcome'>Welcome,</Text>
                    <Text className='text-3xl font-pbold text-white mt-1'>{user?.name}</Text>
                    <View className='bg-secondary-100 px-3 py-1 rounded-full mt-3 self-start'>
                      <Text className='text-white text-sm font-pmedium capitalize'>
                        {user?.role}
                      </Text>
                    </View>
                  </View>
                  <View className='bg-black-100 p-3 rounded-2xl'>
                    <Image source={images.logoSmall} className='w-10 h-11' resizeMode='contain' />
                  </View>
                </View>
              </View>

              {/* Stats Cards */}
              <View className='flex-row gap-3 mb-6'>
                <View className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-secondary-200'>
                  <Text className='text-gray-100 text-sm font-pregular mb-1'>Upcoming Events</Text>
                  <Text className='text-white text-3xl font-pbold'>{upcomingEventsCount}</Text>
                </View>
                <View className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-border'>
                  <Text className='text-gray-100 text-sm font-pregular mb-1'>Total Capacity</Text>
                  <Text className='text-white text-3xl font-pbold'>
                    {events?.data?.reduce((sum, event) => sum + event.capacity, 0) || 0}
                  </Text>
                </View>
              </View>

              {/* Section Title */}
              <View className='flex-row items-center justify-between mb-4'>
                <View>
                  <Text className='text-white text-xl font-pbold'>Upcoming Events</Text>
                  <Text className='text-gray-100 text-sm font-pregular mt-1'>
                    School events you can join
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title='No Events Found'
              subtitle='There are currently no events available'
            />
          )}
        />
      ) : (
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
                  <Text className='font-pregular text-base text-gray-100' testID='welcome'>Welcome Back,</Text>
                  <Text className='text-3xl font-pbold text-white mt-1'>{user?.name}</Text>
                  <View className='bg-secondary-100 px-3 py-1 rounded-full mt-3 self-start'>
                    <Text className='text-white text-sm font-pmedium capitalize'>
                      {user?.role || 'Student'}
                    </Text>
                  </View>
                </View>
                <View className='bg-black-100 p-3 rounded-2xl'>
                  <Image source={images.logoSmall} className='w-10 h-11' resizeMode='contain' />
                </View>
              </View>
            </View>

            {/* Stats Cards */}
            <View className='flex-row gap-3 mb-6'>
              <View className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-yellow-500'>
                <Text className='text-gray-100 text-sm font-pregular mb-1'>Pending</Text>
                <Text className='text-white text-3xl font-pbold'>{pendingApplications}</Text>
              </View>
              <View className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-green-500'>
                <Text className='text-gray-100 text-sm font-pregular mb-1'>Accepted</Text>
                <Text className='text-white text-3xl font-pbold'>{acceptedApplications}</Text>
              </View>
            </View>

            {/* Section Title */}
            <View className='flex-row items-center justify-between mb-4'>
              <View>
                <Text className='text-white text-xl font-pbold'>Your Applications</Text>
                <Text className='text-gray-100 text-sm font-pregular mt-1'>
                  Track your mentor application status
                </Text>
              </View>
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
      )}
    </SafeAreaView>
  )
}
export default Home