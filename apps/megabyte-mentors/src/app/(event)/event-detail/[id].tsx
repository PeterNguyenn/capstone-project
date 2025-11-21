import {
  Text,
  ScrollView,
  Alert,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import { icons } from '../../../constants';
import { useJoinEventMutation } from '../../../api/individual-queries/event/mutations';
import { useEvent, useEventMentors } from '../../../api/individual-queries/event/queries';
import { useGlobalContext } from '../../../context/GlobalProvider';
import Loader from '../../../components/Loader';
import CapacityChip from '../../../components/CapacityChip';

const EventDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useGlobalContext();
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null);

  const { mutate: joinEvent, isPending } =
    useJoinEventMutation({
      onSuccess: () => {
        Alert.alert('Success', 'Successfully registered for event');
        router.back();
      },

      onError: (error) => {
        Alert.alert('Error', error.message);
      },
    });

  const { data: eventData, isPending: pending } = useEvent({ id });
  const { data: eventMentorData } = useEventMentors({ id }, user?.role === 'admin' || user?.role === 'mentor');
  const event = eventData;

  // Check if current user is registered
  // For mentors, the API only returns their own registration, so if data has items, they're registered
  const isUserRegistered = user?.role === 'mentor' && eventMentorData && eventMentorData.data.length > 0;

  const handleRegister = () => {
    joinEvent({
      id,
      userId: user?._id || '',
    });
  };

  if (!event) {
    return (
      <Loader isLoading={pending} />
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="bg-black-200 pt-6 pb-8 px-4">
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-black-100 p-3 rounded-lg"
            >
              <Image
                source={icons.leftArrow}
                resizeMode="contain"
                className="w-5 h-5"
                tintColor="#FF9C01"
              />
            </TouchableOpacity>
            <Text className="text-xl text-white font-pbold">
              Event Details
            </Text>
            <CapacityChip capacity={event.capacity} attendeesCount={event.attendeesCount}/>
          </View>

          {/* Event Title Header */}
          <View className="items-center mt-4">
            <View className="w-20 h-20 bg-secondary-100 rounded-full items-center justify-center mb-3">
              <Text className="text-white text-3xl font-pbold text-center" style={{ lineHeight: 40 }}>
                {event.title.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-white text-2xl font-pbold text-center">
              {event.title}
            </Text>
            <Text className="text-gray-100 text-base font-pregular mt-2 text-center capitalize">
              {event.campus}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-4 -mt-4">
          {/* Description Card */}
          <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-5 uppercase">
              About This Event
            </Text>
            <Text className="text-white text-base font-pregular leading-6">
              {event.shortDescription}
            </Text>
          </View>

          {/* Date & Time Card */}
          <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-5 uppercase">
              Date & Time
            </Text>
            <View className="mb-5">
              <Text className="text-gray-100 text-sm font-pregular mb-2">Date</Text>
              <Text className="text-white text-base font-pmedium">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-gray-100 text-sm font-pregular mb-2">Start Time</Text>
                <Text className="text-white text-base font-pmedium">
                  {event.startTime}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-100 text-sm font-pregular mb-2">End Time</Text>
                <Text className="text-white text-base font-pmedium">
                  {event.endTime}
                </Text>
              </View>
            </View>
          </View>

          {/* Location Card */}
          <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-5 uppercase">
              Location
            </Text>
            <View className="mb-5">
              <Text className="text-gray-100 text-sm font-pregular mb-2">Venue</Text>
              <Text className="text-white text-base font-pmedium">
                {event.location}
              </Text>
            </View>
            <View>
              <Text className="text-gray-100 text-sm font-pregular mb-2">Campus</Text>
              <Text className="text-white text-base font-pmedium capitalize">
                {event.campus}
              </Text>
            </View>
          </View>

          {/* Capacity Card */}
          <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-5 uppercase">
              Registration
            </Text>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-gray-100 text-sm font-pregular mb-2">Registered Mentors</Text>
                <Text className="text-white text-3xl font-pbold">
                  {event.attendeesCount}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-100 text-sm font-pregular mb-2">Total Capacity</Text>
                <Text className="text-white text-3xl font-pbold">
                  {event.capacity}
                </Text>
              </View>
            </View>
          </View>

          {/* Participants List - Admin Only */}
          {user?.role === 'admin' && eventMentorData && eventMentorData.data.length > 0 && (
            <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
              <Text className="text-gray-100 text-sm font-pmedium mb-5 uppercase">
                Registered Participants ({eventMentorData.data.length})
              </Text>

              {eventMentorData.data.map((participant, index) => {
                const isExpanded = expandedParticipant === participant.studentId;

                return (
                  <View key={participant.studentId}>
                    {index > 0 && <View className="border-t border-gray-700 my-5" />}

                    <TouchableOpacity
                      onPress={() => setExpandedParticipant(isExpanded ? null : participant.studentId)}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-white font-pbold text-base">
                            {participant.name}
                          </Text>
                          <Text className="text-gray-100 font-pregular text-sm mt-1">
                            Student ID: {participant.studentId}
                          </Text>
                        </View>
                        <View className="bg-black-200 p-2 rounded-lg">
                          <Text className="text-secondary text-base">
                            {isExpanded ? '▲' : '▼'}
                          </Text>
                        </View>
                      </View>

                      {isExpanded && (
                        <View className="mt-4 ml-2">
                          <View className="mb-4">
                            <Text className="text-gray-100 text-sm font-pregular mb-2">Current Term</Text>
                            <Text className="text-white text-base font-pmedium">
                              {participant.currentTerm}
                            </Text>
                          </View>
                          <View className="mb-4">
                            <Text className="text-gray-100 text-sm font-pregular mb-2">Phone Number</Text>
                            <Text className="text-white text-base font-pmedium">
                              {participant.phoneNumber}
                            </Text>
                          </View>
                          <View>
                            <Text className="text-gray-100 text-sm font-pregular mb-2">Email Address</Text>
                            <Text className="text-white text-base font-pmedium">
                              {participant.email}
                            </Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {/* Action Buttons */}
          {user?.role === 'mentor' && !isUserRegistered && (
            <CustomButton
              title="Register for Event"
              handlePress={handleRegister}
              containerStyle="mb-8"
              textStyle="text-white"
              isLoading={isPending}
              testID='register-event'
            />
          )}

          {user?.role === 'mentor' && isUserRegistered && (
            <View className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-4 mb-8">
              <Text className="text-green-500 text-center font-psemibold text-base">
                ✓ You are registered for this event
              </Text>
            </View>
          )}

          {user?.role === 'admin' && (
            <CustomButton
              title="Send Event Reminder"
              handlePress={() => router.push(`/event-reminder/${id}`)}
              containerStyle="mb-8"
              textStyle="text-white"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventDetail;
