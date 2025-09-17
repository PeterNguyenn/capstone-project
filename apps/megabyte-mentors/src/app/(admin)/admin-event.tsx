import { View, TouchableOpacity, Image, ScrollView, Text} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import PickerField from '../../components/PickerField';
import { campusOptions } from '../../constants/data';
import CustomButton from '../../components/CustomButton';

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

  const handleSubmit = async () => {
    console.log('Event form submitted:', form);
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
            value={form.date}
            placeholder="Enter start time..."
            handleChangeText={(e) => setForm({ ...form, startTime: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="End Time"
            value={form.date}
            placeholder="Enter end time..."
            handleChangeText={(e) => setForm({ ...form, endTime: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="Location"
            value={form.date}
            placeholder="Enter location..."
            handleChangeText={(e) => setForm({ ...form, location: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="Capacity"
            value={form.date}
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

          <CustomButton title='Create Event' handlePress={handleSubmit} containerStyle='mt-7' testID='create-event' />

      </ScrollView>
    </SafeAreaView>
  );
};

export default Event;
