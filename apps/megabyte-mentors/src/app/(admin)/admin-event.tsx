import { View, TouchableOpacity, Image, ScrollView, Text, Alert} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import PickerField from '../../components/PickerField';
import { campusOptions } from '../../constants/data';
import CustomButton from '../../components/CustomButton';
import eventService from '../../api/services/event.service';
import { useApiMutation } from '../../api/hooks';
import { ApiError } from '../../api/utils';

const Event = () => {
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

  const { mutate: createEvent, loading } = useApiMutation(
    eventService.createEvent
  );

  const handleSubmit = async () => {
    try {
      const response = await createEvent({
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
      console.log('Event created successfully:', response);

      Alert.alert('Success', 'Successfully created event');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        // Error is already captured in the hook
        console.log(err.message);
      }
    }
    // Here you would typically send the form data to your backend API
  }
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
          <Text className="text-2xl text-white font-psemibold">
            Create Event & workshop
          </Text>
          <FormField
            title="Event Title"
            value={form.title}
            placeholder="Enter your title..."
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyles="mt-10"
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
          />
          <FormField
            title="Date"
            value={form.date}
            placeholder="Enter date..."
            handleChangeText={(e) => setForm({ ...form, date: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="Start Time"
            value={form.startTime}
            placeholder="Enter start time..."
            handleChangeText={(e) => setForm({ ...form, startTime: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="End Time"
            value={form.endTime}
            placeholder="Enter end time..."
            handleChangeText={(e) => setForm({ ...form, endTime: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="Location"
            value={form.location}
            placeholder="Enter location..."
            handleChangeText={(e) => setForm({ ...form, location: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="Capacity"
            value={form.capacity}
            placeholder="Enter limit of participants..."
            handleChangeText={(e) => setForm({ ...form, capacity: e })}
            otherStyles="mt-10"
          />
          <PickerField
            data={campusOptions}
            title="Campus"
            otherStyles="mt-6"
            handleChangeText={(e) => setForm({ ...form, campus: e })}
          />

          <CustomButton title='Create Event' handlePress={handleSubmit} isLoading={loading} containerStyle='mt-7' testID='create-event' />

      </ScrollView>
    </SafeAreaView>
  );
};

export default Event;
