import { View, Text, FlatList} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventItem from '../../components/EventItem';
import EmptyState from '../../components/EmptyState';
import { useEvents } from '../../api/individual-queries/event/queries';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';

const Event = () => {    
  const { data: events } = useEvents({ upcoming: true})

  return (
    <SafeAreaView className="bg-primary h-full">
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
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-center flex-row mb-6'>
              <View>
                <Text className='text-2xl font-psemibold text-white'>Events & Workshop</Text>
              </View>
              <View>
                <CustomButton title='Create' handlePress={() => router.push(`/create-event`)} testID='create-event-button' containerStyle='min-h-[32px] px-4'/>
              </View>
            </View>

            <View className='w-full flex-1 pt-5'>
              <Text className='text-gray-100 text-lg font-pregular mb-3'>Upcoming</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No Events Found'
            subtitle='There are currently no events available. Please create one.'
            redirectPath='/create-event'
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Event;
