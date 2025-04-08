import { Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { isObjectFilledOut } from '../../utils/check-empty-object';
import { useApiMutation } from '../../api/hooks';
import applicationService from '../../api/services/application.service';
import { router } from 'expo-router';
import { ApiError } from '../../api/utils';

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

const Application = () => {
  const [form, setForm] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(1);

  const { mutate: createApplication, loading } = useApiMutation(
    applicationService.createApplication
  );

  /*const submit = async () => {
    if (!isObjectFilledOut(form)) {
      return Alert.alert('Please provide all fields');
    }*/
      const submit = async () => {
        // Define the required fields that are displayed in the application
        const requiredFields = [
          'studentName',
          'studentNumber',
          'address',
          'phoneNumber',
          'emailAddress',
          'firstReferenceName',
          'firstReferenceRelationship',
          'firstReferencePhoneNumber',
          'firstReferenceEmailAddress',
          'secondReferenceName',
          'secondReferenceRelationship',
          'secondReferencePhoneNumber',
          'secondReferenceEmailAddress',
          'whyInterested',
        ] as (keyof typeof form)[];
      
        // Check if all required fields are filled
        const missingField = requiredFields.find((field) => !form[field]?.trim());
        if (missingField) {
          return Alert.alert(
            'Incomplete Form',
            `Please fill out the field: "${missingField}".`
          );
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
      console.log("Application created successfully");
      Alert.alert('Success', 'Post uploaded successfully');
      router.push('/home');
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Error', err.message);
      }
    } finally {
      
      setForm(initialState);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <FormField
              title="Student Name"
              value={form.studentName}
              placeholder="Enter your full name..."
              handleChangeText={(e) => setForm({ ...form, studentName: e })}
              otherStyles="mt-10"
            />
            <FormField
              title="Student Number"
              value={form.studentNumber}
              placeholder="Enter your student ID number..."
              handleChangeText={(e) => setForm({ ...form, studentNumber: e })}
              otherStyles="mt-6"
            />
            <FormField
              title="Address"
              value={form.address}
              placeholder="Enter your current address..."
              handleChangeText={(e) => setForm({ ...form, address: e })}
              otherStyles="mt-6"
            />
            <FormField
              title="Phone Number"
              value={form.phoneNumber}
              placeholder="Enter your primary phone number..."
              handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
              otherStyles="mt-6"
            />
            <FormField
              title="Alternate Number"
              value={form.alternateNumber}
              placeholder="Enter an alternate phone number (optional)..."
              handleChangeText={(e) => setForm({ ...form, alternateNumber: e })}
              otherStyles="mt-6"
            />
            <FormField
              title="Email Address"
              value={form.emailAddress}
              placeholder="Enter your email address..."
              handleChangeText={(e) => setForm({ ...form, emailAddress: e })}
              otherStyles="mt-6"
            />
            <FormField
              title="Accommodations Required"
              value={form.accommodationsRequired}
              placeholder="Describe any accommodations you may need..."
              handleChangeText={(e) =>
                setForm({ ...form, accommodationsRequired: e })
              }
              otherStyles="mt-6"
            />
            <CustomButton
              title="Next"
              handlePress={() => setCurrentStep(2)}
              containerStyle="mt-7"
            />
          </>
        );
      case 2:
        return (
          <>
            <FormField
              title="First Reference Name"
              value={form.firstReferenceName}
              placeholder="Enter your first reference's full name..."
              handleChangeText={(e) =>
                setForm({ ...form, firstReferenceName: e })
              }
              otherStyles="mt-6"
            />
            <FormField
              title="First Reference Relationship"
              value={form.firstReferenceRelationship}
              placeholder="How do you know this reference?"
              handleChangeText={(e) =>
                setForm({ ...form, firstReferenceRelationship: e })
              }
              otherStyles="mt-6"
            />
            <FormField
              title="First Reference Phone Number"
              value={form.firstReferencePhoneNumber}
              placeholder="Enter your first reference's phone number..."
              handleChangeText={(e) =>
                setForm({ ...form, firstReferencePhoneNumber: e })
              }
              otherStyles="mt-6"
            />
            <FormField
              title="First Reference Email Address"
              value={form.firstReferenceEmailAddress}
              placeholder="Enter your first reference's email address..."
              handleChangeText={(e) =>
                setForm({ ...form, firstReferenceEmailAddress: e })
              }
              otherStyles="mt-6"
            />
            <CustomButton
              title="Previous"
              handlePress={() => setCurrentStep(1)}
              containerStyle="mt-7"
            />
            <CustomButton
              title="Next"
              handlePress={() => setCurrentStep(3)}
              containerStyle="mt-7"
            />
          </>
        );
      case 3:
        return (
          <>
            <FormField
              title="Second Reference Name"
              value={form.secondReferenceName}
              placeholder="Enter your second reference's full name..."
              handleChangeText={(e) =>
                setForm({ ...form, secondReferenceName: e })
              }
              otherStyles="mt-6"
              
            />
            <FormField
              title="Second Reference Relationship"
              value={form.secondReferenceRelationship}
              placeholder="How do you know this reference?"
              handleChangeText={(e) =>
                setForm({ ...form, secondReferenceRelationship: e })
              }
              otherStyles="mt-6"
              
            />
            
            <FormField
              title="Second Reference Phone Number"
              value={form.secondReferencePhoneNumber}
              placeholder="Enter your second reference's phone number..."
              handleChangeText={(e) =>
                setForm({ ...form, secondReferencePhoneNumber: e })
              }
              otherStyles="mt-6"
              
            />

          <FormField
              title="Second Reference Email Address"
              value={form.secondReferenceEmailAddress}
              placeholder="Enter your second reference's email address..."
              handleChangeText={(e) =>
                setForm({ ...form, secondReferenceEmailAddress: e })
              }
              otherStyles="mt-6"
              
            />

            <FormField
              title="Why Are You Interested?"
              value={form.whyInterested}
              placeholder="Explain why you are interested..."
              handleChangeText={(e) => setForm({ ...form, whyInterested: e })}
              otherStyles="mt-6"
            />
            <CustomButton
              title="Previous"
              handlePress={() => setCurrentStep(2)}
              containerStyle="mt-7"
            />
            <CustomButton
              title="Submit"
              handlePress={submit}
              containerStyle="mt-7"
              isLoading={loading}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Apply to Become Mentor
        </Text>
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Application;
