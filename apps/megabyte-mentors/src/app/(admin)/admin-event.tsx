import { View, Text, SectionList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventItem from '../../components/EventItem';
import EmptyState from '../../components/EmptyState';
import { useEvents } from '../../api/individual-queries/event/queries';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import { images } from '../../constants';

const Event = () => {
  const { data: upcomingEvents } = useEvents({ upcoming: true });
  const { data: previousEvents } = useEvents({ upcoming: false });

  const upcomingCount = upcomingEvents?.data?.length || 0;
  const previousCount = previousEvents?.data?.length || 0;
  const totalCapacity = upcomingEvents?.data?.reduce((sum, event) => sum + event.capacity, 0) || 0;
  const totalRegistered = upcomingEvents?.data?.reduce((sum, event) => sum + event.attendeesCount, 0) || 0;

  // Create sections for the list
  const sections = [];

  if (upcomingEvents?.data && upcomingEvents.data.length > 0) {
    sections.push({
      title: 'Upcoming Events',
      data: upcomingEvents.data,
    });
  }

  if (previousEvents?.data && previousEvents.data.length > 0) {
    sections.push({
      title: 'Previous Events',
      data: previousEvents.data,
    });
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <SectionList
        sections={sections}
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
        renderSectionHeader={({section: {title}}) => (
          <View className='px-4 pb-3 pt-6 bg-primary'>
            <Text className='text-white text-xl font-pbold'>{title}</Text>
            <Text className='text-gray-100 text-sm font-pregular mt-1'>
              {title === 'Upcoming Events'
                ? 'Events scheduled for the future'
                : 'Past events and workshops'}
            </Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View className='px-4 pb-4'>
            {/* Header Section */}
            <View className='bg-black-200 rounded-3xl p-6 mt-6 mb-6 shadow-lg'>
              <View className='flex-row justify-between items-start mb-4'>
                <View className='flex-1'>
                  <Text testID='event-title' className='text-3xl font-pbold text-white'>Events & Workshops</Text>
                  <Text className='text-gray-100 text-base font-pregular mt-2'>
                    Manage all school events
                  </Text>
                </View>
                <View className='bg-black-100 p-3 rounded-2xl'>
                  <Image source={images.logoSmall} className='w-10 h-11' resizeMode='contain' />
                </View>
              </View>

              {/* Create Event Button */}
              <View className='mt-4'>
                <CustomButton
                  title='Create New Event'
                  handlePress={() => router.push(`/create-event`)}
                  testID='create-event-button'
                  containerStyle='bg-secondary'
                />
              </View>
            </View>

            {/* Stats Overview */}
            <View className='mb-6'>
              <Text className='text-white text-lg font-pbold mb-4'>Overview</Text>

              {/* First Row - Upcoming and Previous */}
              <View className='flex-row gap-3 mb-3'>
                <TouchableOpacity className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-secondary-200'>
                  <Text className='text-gray-100 text-sm font-pregular mb-1'>Upcoming Events</Text>
                  <Text className='text-white text-3xl font-pbold'>{upcomingCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-border'>
                  <Text className='text-gray-100 text-sm font-pregular mb-1'>Previous Events</Text>
                  <Text className='text-white text-3xl font-pbold'>{previousCount}</Text>
                </TouchableOpacity>
              </View>

              {/* Second Row - Capacity and Registered */}
              <View className='flex-row gap-3'>
                <View className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-blue-500'>
                  <Text className='text-gray-100 text-sm font-pregular mb-1'>Total Capacity</Text>
                  <Text className='text-white text-3xl font-pbold'>{totalCapacity}</Text>
                </View>
                <View className='flex-1 bg-black-100 rounded-2xl p-4 border-2 border-green-500'>
                  <Text className='text-gray-100 text-sm font-pregular mb-1'>Total Registered</Text>
                  <Text className='text-white text-3xl font-pbold'>{totalRegistered}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No Events Found'
            subtitle='There are currently no events available. Create your first event to get started.'
            redirectPath='/create-event'
          />
        )}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

export default Event;
