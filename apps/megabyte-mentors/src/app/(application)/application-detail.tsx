import { Text, ScrollView, Alert, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { isObjectFilledOut } from '../../utils/check-empty-object';
import { useApiMutation } from '../../api/hooks';
import applicationService from '../../api/services/application.service';
import { router, useLocalSearchParams } from 'expo-router';
import { ApiError } from '../../api/utils';
import { icons } from '../../constants';

const initialState = {
  studentName: '',
  studentNumber: '',
  address: '',
  phoneNumber: '',
  alternateNumber: '',
  emailAddress: '',
  programOfStudy: '',
  currentTerm: '',
  numberOfTermsInProgram: '',
  campus: '',
  anticipatedGraduationDate: '',
  dietaryRestrictions: '',
  shirtSize: '',
  accommodationsRequired: '',
  firstReferenceName: '',
  firstReferenceRelationship: '',
  firstReferencePhoneNumber: '',
  firstReferenceEmailAddress: '',
  secondReferenceName: '',
  secondReferenceRelationship: '',
  secondReferencePhoneNumber: '',
  secondReferenceEmailAddress: '',
  whyInterested: '',
  makingDifference: '',
  strengths: '',
  areasOfGrowth: '',
  extraSkills: '',
  additionalInfo: '',
};

const ApplicationDetail = () => {
  const [form, setForm] = useState(initialState);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { mutate: createApplication, loading } = useApiMutation(
    applicationService.createApplication
  );
  const submit = async () => {
    if (!isObjectFilledOut(form)) {
      return Alert.alert('Please provide all fields');
    }

    try {
      await createApplication({
        ...form,
        references: [
          {
            name: form.firstReferenceName,
            relationship: form.firstReferenceRelationship,
            phoneNumber: form.firstReferencePhoneNumber,
            emailAddress: form.firstReferenceEmailAddress,
          },
          {
            name: form.secondReferenceName,
            relationship: form.secondReferenceRelationship,
            phoneNumber: form.secondReferencePhoneNumber,
            emailAddress: form.secondReferenceEmailAddress,
          },
        ],
      });

      Alert.alert('Success', 'Post uploaded successfully');
      router.push('/home');
    } catch (err) {
      if (err instanceof ApiError) {
        // Error is already captured in the hook
        Alert.alert('Error', err.message);
      }
    } finally {
      setForm(initialState);
    }
  };

  const application = {
    studentName: 'John Doe',
    studentNumber: '123456789',
    address: '123 Main St, Toronto, ON',
    phoneNumber: '123-456-7890',
    alternateNumber: '987-654-3210',
    emailAddress: 'john.doe@email.com',
    programOfStudy: 'Computer Science',
    currentTerm: '3',
    numberOfTermsInProgram: '8',
    campus: 'Trafalgar',
    anticipatedGraduationDate: 'May 2026',
    dietaryRestrictions: 'None',
    shirtSize: 'Medium',
    accommodationsRequired: 'None',
    firstReferenceName: 'Dr. Jane Smith',
    firstReferenceRelationship: 'Professor',
    firstReferencePhoneNumber: '111-222-3333',
    firstReferenceEmailAddress: 'jane.smith@faculty.edu',
    secondReferenceName: 'Mr. Robert Johnson',
    secondReferenceRelationship: 'Former Employer',
    secondReferencePhoneNumber: '444-555-6666',
    secondReferenceEmailAddress: 'robert.johnson@company.com',
    whyInterested:
      'I want to help first-year students navigate their academic journey.',
    makingDifference:
      'By sharing my experiences and providing guidance to new students.',
    strengths: 'Communication, problem-solving, and patience.',
    areasOfGrowth: 'Public speaking and time management.',
    extraSkills: 'Fluent in three languages, experienced in tutoring.',
    additionalInfo:
      'I have participated in student orientation programs before.',
  };

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
            Application Detail
          </Text>
          <View className="w-6 h-6" />
        </View>
        <View className="bg-card border-2 border-solid border-border rounded-xl shadow-md p-4 mb-4">
          <Text className="text-xl font-psemibold text-white mb-4">
            Personal Information
          </Text>
          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Student Name:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.studentName}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Student Number:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.studentNumber}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Address:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.address}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Phone Number:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.phoneNumber}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Alternate Number:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.alternateNumber}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Email Address:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.emailAddress}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Dietary Restrictions:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.dietaryRestrictions}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Shirt Size:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.shirtSize}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">
              Accommodations Required:
            </Text>
            <Text className="text-gray-100 font-psemibold">
              {application.accommodationsRequired}
            </Text>
          </View>
        </View>
        <View className="bg-card border-2 border-solid border-border rounded-xl shadow-md p-4 mb-4">
          {/* Academic Information */}
          <Text className="text-xl text-white font-pbold mb-4">
            Academic Information
          </Text>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Program of Study:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.programOfStudy}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Current Term:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.currentTerm}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">
              Number of Terms in Program:
            </Text>
            <Text className="text-gray-100 font-psemibold">
              {application.numberOfTermsInProgram}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Campus:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.campus}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">
              Anticipated Graduation Date:
            </Text>
            <Text className="text-gray-100 font-psemibold">
              {application.anticipatedGraduationDate}
            </Text>
          </View>
        </View>
        {/* Personal Preferences */}
        <View className="bg-card border-2 border-solid border-border rounded-xl shadow-md p-4 mb-4">
          <Text className="text-xl text-white font-pbold mb-4">
            Personal Preferences
          </Text>

          {/* First Reference */}
          <Text className="text-xl text-white font-pbold mb-4">
            First Reference
          </Text>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Name:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.firstReferenceName}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Relationship:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.firstReferenceRelationship}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Phone Number:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.firstReferencePhoneNumber}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Email Address:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.firstReferenceEmailAddress}
            </Text>
          </View>

          <View className="border-b-gray-100 border-2 mt-2 mb-4" />

          {/* Second Reference */}
          <Text className="text-xl text-white font-pbold mb-4">
            Second Reference
          </Text>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Name:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.secondReferenceName}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Relationship:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.secondReferenceRelationship}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Phone Number:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.secondReferencePhoneNumber}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Email Address:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.secondReferenceEmailAddress}
            </Text>
          </View>
        </View>

        <View className="bg-card border-2 border-solid border-border rounded-xl shadow-md p-4 mb-4">
          {/* Essay Questions */}
          <Text className="text-xl text-white font-pbold mb-4">
            Essay Questions
          </Text>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">
              Why Are You Interested?
            </Text>
            <Text className="text-gray-100 font-psemibold">
              {application.whyInterested}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">
              How Will You Make a Difference?
            </Text>
            <Text className="text-gray-100 font-psemibold">
              {application.makingDifference}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Your Strengths:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.strengths}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Areas for Growth:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.areasOfGrowth}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Extra Skills:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.extraSkills}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">
              Additional Information:
            </Text>
            <Text className="text-gray-100 font-psemibold">
              {application.additionalInfo}
            </Text>
          </View>
        </View>

        <View className='flex-row items-center gap-2'>
          <CustomButton
            title="Reject"
            handlePress={submit}
            containerStyle="mt-7 bg-status-rejected flex-1"
            textStyle='text-white'
            isLoading={loading}
          />
          <CustomButton
            title="Approve"
            handlePress={submit}
            containerStyle="mt-7 bg-status-approved flex-1"
            textStyle='text-white'
            isLoading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ApplicationDetail;
