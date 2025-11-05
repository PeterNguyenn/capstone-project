import { View, TouchableOpacity, Image, ScrollView, Text, Alert, Platform} from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());

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

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDisplayTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setForm({ ...form, date: formatDate(selectedDate) });
    }
  };

  const onStartTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartTimePicker(false);
    }
    if (selectedTime) {
      setSelectedStartTime(selectedTime);
      setForm({ ...form, startTime: formatTime(selectedTime) });
    }
  };

  const onEndTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndTimePicker(false);
    }
    if (selectedTime) {
      setSelectedEndTime(selectedTime);
      setForm({ ...form, endTime: formatTime(selectedTime) });
    }
  };

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
          <View className="mt-6">
            <Text className="text-base text-gray-100 font-pmedium mb-2">Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex-row items-center justify-between"
              testID='event-date-input'
            >
              <Text className={`font-psemibold text-base ${form.date ? 'text-white' : 'text-gray-400'}`}>
                {form.date ? formatDisplayDate(selectedDate) : 'Select date...'}
              </Text>
              <Image source={icons.rightArrow} className="w-5 h-5" resizeMode="contain" tintColor="#7B7B8B" />
            </TouchableOpacity>
            {showDatePicker && (
              <View className="items-center mt-2">
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  themeVariant="dark"
                />
              </View>
            )}
            {Platform.OS === 'ios' && showDatePicker && (
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                className="bg-secondary rounded-lg p-3 mt-2"
              >
                <Text className="text-white text-center font-psemibold">Done</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="mt-6">
            <Text className="text-base text-gray-100 font-pmedium mb-2">Start Time</Text>
            <TouchableOpacity
              onPress={() => setShowStartTimePicker(true)}
              className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex-row items-center justify-between"
              testID='event-starttime-input'
            >
              <Text className={`font-psemibold text-base ${form.startTime ? 'text-white' : 'text-gray-400'}`}>
                {form.startTime ? formatDisplayTime(selectedStartTime) : 'Select start time...'}
              </Text>
              <Image source={icons.rightArrow} className="w-5 h-5" resizeMode="contain" tintColor="#7B7B8B" />
            </TouchableOpacity>
            {showStartTimePicker && (
              <View className="items-center mt-2">
                <DateTimePicker
                  value={selectedStartTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onStartTimeChange}
                  themeVariant="dark"
                />
              </View>
            )}
            {Platform.OS === 'ios' && showStartTimePicker && (
              <TouchableOpacity
                onPress={() => setShowStartTimePicker(false)}
                className="bg-secondary rounded-lg p-3 mt-2"
              >
                <Text className="text-white text-center font-psemibold">Done</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="mt-6">
            <Text className="text-base text-gray-100 font-pmedium mb-2">End Time</Text>
            <TouchableOpacity
              onPress={() => setShowEndTimePicker(true)}
              className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex-row items-center justify-between"
              testID='event-endtime-input'
            >
              <Text className={`font-psemibold text-base ${form.endTime ? 'text-white' : 'text-gray-400'}`}>
                {form.endTime ? formatDisplayTime(selectedEndTime) : 'Select end time...'}
              </Text>
              <Image source={icons.rightArrow} className="w-5 h-5" resizeMode="contain" tintColor="#7B7B8B" />
            </TouchableOpacity>
            {showEndTimePicker && (
              <View className="items-center mt-2">
                <DateTimePicker
                  value={selectedEndTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onEndTimeChange}
                  themeVariant="dark"
                />
              </View>
            )}
            {Platform.OS === 'ios' && showEndTimePicker && (
              <TouchableOpacity
                onPress={() => setShowEndTimePicker(false)}
                className="bg-secondary rounded-lg p-3 mt-2"
              >
                <Text className="text-white text-center font-psemibold">Done</Text>
              </TouchableOpacity>
            )}
          </View>
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
