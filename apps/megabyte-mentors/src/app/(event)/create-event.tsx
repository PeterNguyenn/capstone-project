import { View, TouchableOpacity, Image, ScrollView, Text, Alert} from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import PickerField from '../../components/PickerField';
import { campusOptions } from '../../constants/data';
import CustomButton from '../../components/CustomButton';
import { ApiError } from '../../api/utils';
import { icons } from '../../constants';
import { useCreateEventMutation } from '../../api/individual-queries/event/mutations';


const CreateEvent = () => {
  const [form, setForm] = useState({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      capacity: '',
      campus: '',
  })

  const { mutate: createEvent, isPending } = useCreateEventMutation({
    onSuccess: () => {
      Alert.alert('Success', 'Successfully created event');
      router.back();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        Alert.alert('Error', error.message);
      }
    },
  })

  const handleSubmit = async () => {
    try {
      await createEvent({
        title: form.title,
        shortDescription: form.description,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location,
        capacity: parseInt(form.capacity, 10),
        campus: form.campus,
        status: 'published'
      });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        // Error is already captured in the hook
        console.log(err.message);
      }
    }  }
  
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
          <Text className="text-2xl text-white font-psemibold" testID='create-event-title'>
            Create Event
          </Text>
          <View className="w-6 h-6" />
        </View>
          <FormField
            title="Event Title"
            value={form.title}
            placeholder="Enter your title..."
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyles="mt-10"
            testID='event-title-input'
          />
          <FormField
            title="Description"
            value={form.description}
            placeholder="short description about the event..."
            handleChangeText={(e) => setForm({ ...form, description: e })}
            otherStyles="mt-6"
            multiline
            numberOfLines={4}
            maxLength={250}
            inputStyles="h-48"
            testID='event-description-input'
          />
          <FormField
            title="Date"
            value={form.date}
            placeholder="Enter date..."
            handleChangeText={(e) => setForm({ ...form, date: e })}
            otherStyles="mt-10"
            testID='event-date-input'
          />
          <FormField
            title="Start Time"
            value={form.startTime}
            placeholder="Enter start time..."
            handleChangeText={(e) => setForm({ ...form, startTime: e })}
            otherStyles="mt-10"
            testID='event-starttime-input'
          />
          <FormField
            title="End Time"
            value={form.endTime}
            placeholder="Enter end time..."
            handleChangeText={(e) => setForm({ ...form, endTime: e })}
            otherStyles="mt-10"
            testID='event-endtime-input'
          />
          <FormField
            title="Location"
            value={form.location}
            placeholder="Enter location..."
            handleChangeText={(e) => setForm({ ...form, location: e })}
            otherStyles="mt-10"
            testID='event-location-input'
          />
          <FormField
            title="Capacity"
            value={form.capacity}
            placeholder="Enter limit of participants..."
            handleChangeText={(e) => setForm({ ...form, capacity: e })}
            otherStyles="mt-10"
            keyboardType='numeric'
            testID='event-capacity-input'
          />
          <PickerField
            data={campusOptions}
            title="Campus"
            otherStyles="mt-6"
            handleChangeText={(e) => setForm({ ...form, campus: e })}
            testID='event-campus-input'
          />

          <CustomButton title='Create Event' handlePress={handleSubmit} isLoading={isPending} containerStyle='mt-7' testID='create-event' />

      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateEvent;
