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
      <ScrollView className="px-4 my-6">
        <View className="flex-row items-center justify-between mb-7">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex items-start"
          >
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>
          <Text className="text-2xl text-white font-psemibold">
            Event Detail
          </Text>
          <CapacityChip capacity={event.capacity} attendeesCount={event.attendeesCount}/>
        </View>

        <View className="bg-card border-2 border-solid border-border rounded-xl shadow-md p-4 mb-4">
          <Text className="text-xl font-psemibold text-white mb-4">
            Event Information
          </Text>
          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Title:</Text>
            <Text className="text-gray-100 font-psemibold">
              {event.title}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Description:</Text>
            <Text className="text-gray-100 font-psemibold">
              {event.shortDescription}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Date:</Text>
            <Text className="text-gray-100 font-psemibold">
              {event.date}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Start Time:</Text>
            <Text className="text-gray-100 font-psemibold">
              {event.startTime}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">End Time:</Text>
            <Text className="text-gray-100 font-psemibold">
              {event.endTime}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Mentors registered:</Text>
            <Text className="text-gray-100 font-psemibold">
              {event.attendeesCount}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Capacity (mentors):</Text>
            <Text className="text-gray-100 font-psemibold">
              {event.capacity}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Location:</Text>
            <Text className="text-gray-100 font-psemibold">
              {event.location}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">
              Campus:
            </Text>
            <Text className="text-gray-100 font-psemibold">
              {event.campus}
            </Text>
          </View>
        </View>

        {user?.role === 'admin' && eventMentorData && eventMentorData.data.length > 0 && (
          <View className="bg-card border-2 border-solid border-border rounded-xl shadow-md p-4 mb-4">
            <Text className="text-xl text-white font-pbold mb-4">
              Event Participants ({eventMentorData.data.length})
            </Text>

            {eventMentorData.data.map((participant, index) => {
              const isExpanded = expandedParticipant === participant.studentId;

              return (
                <TouchableOpacity
                  key={participant.studentId}
                  onPress={() => setExpandedParticipant(isExpanded ? null : participant.studentId)}
                  activeOpacity={0.7}
                >
                  {index > 0 && <View className="border-b-gray-100 border-2 mt-2 mb-4" />}

                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-white font-pbold text-base">
                        {participant.name}
                      </Text>
                      <Text className="text-gray-100 font-pregular text-sm mt-1">
                        ID: {participant.studentId}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-xl">
                      {isExpanded ? '▲' : '▼'}
                    </Text>
                  </View>

                  {isExpanded && (
                    <View className="ml-2 mt-3">
                      <View className="flex-col items-start gap-1 mb-2">
                        <Text className="text-white font-pbold">Current Term:</Text>
                        <Text className="text-gray-100 font-psemibold">
                          {participant.currentTerm}
                        </Text>
                      </View>
                      <View className="flex-col items-start gap-1 mb-2">
                        <Text className="text-white font-pbold">Phone Number:</Text>
                        <Text className="text-gray-100 font-psemibold">
                          {participant.phoneNumber}
                        </Text>
                      </View>
                      <View className="flex-col items-start gap-1 mb-2">
                        <Text className="text-white font-pbold">Email Address:</Text>
                        <Text className="text-gray-100 font-psemibold">
                          {participant.email}
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

      {user?.role === 'mentor' && !isUserRegistered && (
        <CustomButton
          title="Register for Event"
          handlePress={handleRegister}
          containerStyle="mt-7 flex-1"
          textStyle="text-white"
          isLoading={isPending}
          testID='register-event'
        />
        )}
        {user?.role === 'mentor' && isUserRegistered && (
        <View className="bg-green-900 border-2 border-green-500 rounded-xl p-4 mt-7">
          <Text className="text-green-400 text-center font-psemibold text-base">
            ✓ You are registered for this event
          </Text>
        </View>
        )}
        {user?.role === 'admin' && (
        <CustomButton
          title="Send Event Reminder"
          handlePress={() => router.push(`/event-reminder/${id}`)}
          containerStyle="mt-7 flex-1"
          textStyle="text-white"
        />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventDetail;
