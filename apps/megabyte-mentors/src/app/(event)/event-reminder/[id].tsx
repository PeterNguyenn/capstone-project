import { View, TouchableOpacity, Image, ScrollView, Text, Alert} from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../../components/FormField';
import CustomButton from '../../../components/CustomButton';
import { ApiError } from '../../../api/utils';
import { icons } from '../../../constants';
import { useCreateEventReminderMutation } from '../../../api/individual-queries/event/mutations';


const CreateReminder = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [form, setForm] = useState({
      title: '',
      message: '',
  })

  const { mutate: createEvent, isPending } = useCreateEventReminderMutation({
    onSuccess: () => {
      Alert.alert('Success', 'Successfully created event reminder');
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
        id: id,
        title: form.title,
        message: form.message,
      });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        // Error is already captured in the hook
        console.log(err.message);
      }
    } }
  
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
          <Text className="text-2xl text-white font-psemibold" testID='event-title'>
            Create Event Reminder
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
            value={form.message}
            placeholder="short description about the event..."
            handleChangeText={(e) => setForm({ ...form, message: e })}
            otherStyles="mt-6"
            multiline
            numberOfLines={4}
            maxLength={250}
            inputStyles="h-48"
            testID='event-description-input'
          />

          <CustomButton title='Send reminder' handlePress={handleSubmit} isLoading={isPending} containerStyle='mt-7' testID='create-event' />

      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateReminder;
