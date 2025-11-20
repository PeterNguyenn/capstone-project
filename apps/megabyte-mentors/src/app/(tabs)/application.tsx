import { Text, ScrollView, Alert, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import { isObjectFilledOut } from '../../utils/check-empty-object';
import { router } from 'expo-router';
import { ApiError } from '../../api/utils';
import { useCreateApplicationMutation } from '../../api/individual-queries/applications/mutations';
import { useApplications } from '../../api/individual-queries/applications/queries';
import { useGlobalContext } from '../../context/GlobalProvider';
import EmptyState from '../../components/EmptyState';
import PickerField from '../../components/PickerField';
import {
  campusOptions,
  programOptions,
  shirtSizes,
} from '../../constants/data';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

const firstStep = {
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
}

const secondStep = {
  firstReferenceName: '',
  firstReferenceRelationship: '',
  firstReferencePhoneNumber: '',
  firstReferenceEmailAddress: '',
  secondReferenceName: '',
  secondReferenceRelationship: '',
  secondReferencePhoneNumber: '',
  secondReferenceEmailAddress: '',
}

const thirdStep = {
  whyInterested: '',
  makingDifference: '',
  strengths: '',
  areasOfGrowth: '',
  extraSkills: '',
  additionalInfo: '',
}

const Application = () => {
  const [firstStepForm, setFirstStepForm] = useState(firstStep);
  const [secondStepForm, setSecondStepForm] = useState(secondStep);
  const [thirdStepForm, setThirdStepForm] = useState(thirdStep);
  const [error, setError] = useState(false);
  const { user} = useGlobalContext();

  const { data: applications } = useApplications(
    user?.role !== 'admin' && user?._id
      ? {
          userId: user._id,
        }
      : {}
  );

  const { mutate: createApplication, isPending } = useCreateApplicationMutation(
    {
      onSuccess: () => {
        Alert.alert('Success', 'Application submitted successfully');
        router.replace('/home');
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          Alert.alert('Error', error.message);
        }
      },
    }
  );

  const onNextFirstStep = () => {
    // Create a copy of firstStepForm excluding optional fields
    const { alternateNumber, dietaryRestrictions, accommodationsRequired, ...requiredFields } = firstStepForm;

    if (!isObjectFilledOut(requiredFields)) {
      setError(true);
      return Alert.alert('Please provide all required fields');
    } else {
      setError(false);
    }
  }
  const onNextSecondStep = () => {
    if (!isObjectFilledOut(secondStepForm)) {
      setError(true);
      return Alert.alert('Please provide all fields');
    } else {
      setError(false);
    }
  }
  const onSubmit = async () => {
    // Create a copy of thirdStepForm excluding optional fields
    const { additionalInfo, ...requiredFields } = thirdStepForm;

    if (!isObjectFilledOut(requiredFields)) {
      setError(true);
      return Alert.alert('Please provide all required fields');
    } else {
      setError(false);
    }

    try {
      await createApplication({
        ...firstStepForm,
        ...thirdStepForm,
        references: [
          {
            name: secondStepForm.firstReferenceName,
            relationship: secondStepForm.firstReferenceRelationship,
            phoneNumber: secondStepForm.firstReferencePhoneNumber,
            emailAddress: secondStepForm.firstReferenceEmailAddress,
          },
          {
            name: secondStepForm.secondReferenceName,
            relationship: secondStepForm.secondReferenceRelationship,
            phoneNumber: secondStepForm.secondReferencePhoneNumber,
            emailAddress: secondStepForm.secondReferenceEmailAddress,
          },
        ],
      });
      router.push('/home');
    } catch (err) {
      if (err instanceof ApiError) {
        // Error is already captured in the hook
        Alert.alert('Error', err.message);
      }
    } finally {
      setFirstStepForm(firstStep);
      setSecondStepForm(secondStep);
      setThirdStepForm(thirdStep);
    }
  }

  if (applications?.data && applications.data?.length) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <ScrollView className="px-4 my-6">
          <Text className="text-2xl text-white font-psemibold">
            Apply to Become Mentor
          </Text>
          <EmptyState
            title="You have already applied"
            subtitle="Program manager will contact you soon"
            redirectPath="/home"
            redirectText='Go to Home'
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ProgressSteps
        activeLabelColor="#00B1CD"
        activeStepIconColor="#00B1CD"
        completedLabelColor="#48D065"
        completedStepIconColor="#48D065"
        labelFontFamily="Poppins"
        disabledStepNumColor="#041F4A"
        disabledStepIconColor="#CDCDE0"
        topOffset={30}
        marginBottom={0}
      >
        <ProgressStep
          label="Personal Information"
          onNext={onNextFirstStep}
          errors={error}
          buttonBottomOffset={0}
        >
          <ScrollView
            className="flex-1 px-0"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-white text-xl font-pbold mt-6 mb-2">
              Tell us about yourself
            </Text>
            <Text className="text-gray-100 text-sm font-pregular mb-6">
              Please provide your basic information
            </Text>

            {/* Basic Information Card */}
            <View className="bg-black-100 rounded-2xl p-5 mb-4">
              <Text className="text-gray-100 text-xs font-pmedium mb-4 uppercase">
                Basic Information
              </Text>
              <FormField
                title="Student Name"
                value={firstStepForm.studentName}
                placeholder="Enter your full name..."
                handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, studentName: e })}
              />
              <FormField
                title="Student Number"
                value={firstStepForm.studentNumber}
                placeholder="Enter your student ID number..."
                handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, studentNumber: e })}
                otherStyles="mt-4"
                keyboardType="numeric"
              />
            </View>

            {/* Contact Information Card */}
            <View className="bg-black-100 rounded-2xl p-5 mb-4">
              <Text className="text-gray-100 text-xs font-pmedium mb-4 uppercase">
                Contact Information
              </Text>
              <FormField
                title="Email Address"
                value={firstStepForm.emailAddress}
                placeholder="Enter your email address..."
                handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, emailAddress: e })}
                keyboardType="email-address"
              />
              <FormField
                title="Phone Number"
                value={firstStepForm.phoneNumber}
                placeholder="Enter your primary phone number..."
                handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, phoneNumber: e })}
                otherStyles="mt-4"
                keyboardType="phone-pad"
              />
              <FormField
                title="Alternate Number (Optional)"
                value={firstStepForm.alternateNumber}
                placeholder="Enter an alternate phone number..."
                handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, alternateNumber: e })}
                otherStyles="mt-4"
                keyboardType="phone-pad"
              />
              <FormField
                title="Address"
                value={firstStepForm.address}
                placeholder="Enter your current address..."
                handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, address: e })}
                otherStyles="mt-4"
              />
            </View>

            {/* Academic Information Card */}
            <View className="bg-black-100 rounded-2xl p-5 mb-4">
              <Text className="text-gray-100 text-xs font-pmedium mb-4 uppercase">
                Academic Information
              </Text>
              <PickerField
                data={programOptions}
                title="Program of Study"
                handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, programOfStudy: e })}
                value={firstStepForm.programOfStudy}
              />
              <PickerField
                data={campusOptions}
                title="Campus"
                otherStyles="mt-4"
                handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, campus: e })}
                value={firstStepForm.campus}
              />
              <FormField
                title="Current Term"
                value={firstStepForm.currentTerm}
                placeholder="e.g., 3"
                handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, currentTerm: e })}
                otherStyles="mt-4"
                keyboardType="numeric"
              />
              <FormField
                title="Number of Terms in Program"
                value={firstStepForm.numberOfTermsInProgram}
                placeholder="e.g., 6"
                handleChangeText={(e) =>
                  setFirstStepForm({ ...firstStepForm, numberOfTermsInProgram: e })
                }
                otherStyles="mt-4"
                keyboardType="numeric"
              />
              <FormField
                title="Anticipated Graduation Date"
                value={firstStepForm.anticipatedGraduationDate}
                placeholder="e.g., May 2025"
                handleChangeText={(e) =>
                  setFirstStepForm({ ...firstStepForm, anticipatedGraduationDate: e })
                }
                otherStyles="mt-4"
              />
            </View>

            {/* Additional Details Card */}
            <View className="bg-black-100 rounded-2xl p-5 mb-4">
              <Text className="text-gray-100 text-xs font-pmedium mb-4 uppercase">
                Additional Details
              </Text>
              <PickerField
                data={shirtSizes}
                title="Shirt Size"
                handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, shirtSize: e })}
                value={firstStepForm.shirtSize}
              />
              <FormField
                title="Dietary Restrictions (Optional)"
                value={firstStepForm.dietaryRestrictions}
                placeholder="List any dietary restrictions..."
                handleChangeText={(e) =>
                  setFirstStepForm({ ...firstStepForm, dietaryRestrictions: e })
                }
                otherStyles="mt-4"
              />
              <FormField
                title="Accommodations Required (Optional)"
                value={firstStepForm.accommodationsRequired}
                placeholder="Describe any accommodations you may need..."
                handleChangeText={(e) =>
                  setFirstStepForm({ ...firstStepForm, accommodationsRequired: e })
                }
                otherStyles="mt-4"
                multiline
                numberOfLines={3}
                inputStyles="h-24"
              />
            </View>
          </ScrollView>
        </ProgressStep>
        <ProgressStep
          label="References"
          buttonPreviousTextColor='#4E4E61'
          onNext={onNextSecondStep}
          errors={error}
        >
          <ScrollView
            className="flex-1 px-0"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-white text-xl font-pbold mt-6 mb-2">
              Professional References
            </Text>
            <Text className="text-gray-100 text-sm font-pregular mb-6">
              Please provide two professional references (e.g., professors, employers, mentors)
            </Text>

            {/* First Reference Card */}
            <View className="bg-black-100 rounded-2xl p-5 mb-4">
              <Text className="text-secondary text-sm font-psemibold mb-4">
                First Reference
              </Text>
              <FormField
                title="Full Name"
                value={secondStepForm.firstReferenceName}
                placeholder="Enter reference's full name..."
                handleChangeText={(e) =>
                  setSecondStepForm({ ...secondStepForm, firstReferenceName: e })
                }
              />
              <FormField
                title="Relationship"
                value={secondStepForm.firstReferenceRelationship}
                placeholder="e.g., Professor, Employer, Mentor..."
                handleChangeText={(e) =>
                  setSecondStepForm({ ...secondStepForm, firstReferenceRelationship: e })
                }
                otherStyles="mt-4"
              />
              <FormField
                title="Phone Number"
                value={secondStepForm.firstReferencePhoneNumber}
                placeholder="Enter phone number..."
                handleChangeText={(e) =>
                  setSecondStepForm({ ...secondStepForm, firstReferencePhoneNumber: e })
                }
                otherStyles="mt-4"
                keyboardType="phone-pad"
              />
              <FormField
                title="Email Address"
                value={secondStepForm.firstReferenceEmailAddress}
                placeholder="Enter email address..."
                handleChangeText={(e) =>
                  setSecondStepForm({ ...secondStepForm, firstReferenceEmailAddress: e })
                }
                otherStyles="mt-4"
                keyboardType="email-address"
              />
            </View>

            {/* Second Reference Card */}
            <View className="bg-black-100 rounded-2xl p-5 mb-4">
              <Text className="text-secondary text-sm font-psemibold mb-4">
                Second Reference
              </Text>
              <FormField
                title="Full Name"
                value={secondStepForm.secondReferenceName}
                placeholder="Enter reference's full name..."
                handleChangeText={(e) =>
                  setSecondStepForm({ ...secondStepForm, secondReferenceName: e })
                }
              />
              <FormField
                title="Relationship"
                value={secondStepForm.secondReferenceRelationship}
                placeholder="e.g., Professor, Employer, Mentor..."
                handleChangeText={(e) =>
                  setSecondStepForm({ ...secondStepForm, secondReferenceRelationship: e })
                }
                otherStyles="mt-4"
              />
              <FormField
                title="Phone Number"
                value={secondStepForm.secondReferencePhoneNumber}
                placeholder="Enter phone number..."
                handleChangeText={(e) =>
                  setSecondStepForm({ ...secondStepForm, secondReferencePhoneNumber: e })
                }
                otherStyles="mt-4"
                keyboardType="phone-pad"
              />
              <FormField
                title="Email Address"
                value={secondStepForm.secondReferenceEmailAddress}
                placeholder="Enter email address..."
                handleChangeText={(e) =>
                  setSecondStepForm({ ...secondStepForm, secondReferenceEmailAddress: e })
                }
                otherStyles="mt-4"
                keyboardType="email-address"
              />
            </View>
          </ScrollView>
        </ProgressStep>
        <ProgressStep
          label="Interests"
          buttonPreviousTextColor='#4E4E61'
          onSubmit={onSubmit}
          errors={error}
        >
          <ScrollView
            className="flex-1 px-0"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-white text-xl font-pbold mt-6 mb-2">
              Tell Your Story
            </Text>
            <Text className="text-gray-100 text-sm font-pregular mb-6">
              Help us understand your motivations and goals (max 250 characters each)
            </Text>

            {/* Motivation Section */}
            <View className="bg-black-100 rounded-2xl p-5 mb-4">
              <Text className="text-gray-100 text-xs font-pmedium mb-4 uppercase">
                Your Motivation
              </Text>
              <FormField
                title="Why Are You Interested?"
                value={thirdStepForm.whyInterested}
                placeholder="Share what excites you about this opportunity..."
                handleChangeText={(e) => setThirdStepForm({ ...thirdStepForm, whyInterested: e })}
                multiline
                numberOfLines={4}
                maxLength={250}
                inputStyles="h-24"
              />
              <Text className="text-gray-400 text-xs text-right mt-1">
                {thirdStepForm.whyInterested.length}/250
              </Text>

              <FormField
                title="How Will You Make a Difference?"
                value={thirdStepForm.makingDifference}
                placeholder="Describe the impact you hope to create..."
                handleChangeText={(e) =>
                  setThirdStepForm({ ...thirdStepForm, makingDifference: e })
                }
                otherStyles="mt-4"
                multiline
                numberOfLines={4}
                maxLength={250}
                inputStyles="h-24"
              />
              <Text className="text-gray-400 text-xs text-right mt-1">
                {thirdStepForm.makingDifference.length}/250
              </Text>
            </View>

            {/* Skills & Growth Section */}
            <View className="bg-black-100 rounded-2xl p-5 mb-4">
              <Text className="text-gray-100 text-xs font-pmedium mb-4 uppercase">
                Skills & Development
              </Text>
              <FormField
                title="Your Strengths"
                value={thirdStepForm.strengths}
                placeholder="What are your key strengths and talents..."
                handleChangeText={(e) => setThirdStepForm({ ...thirdStepForm, strengths: e })}
                multiline
                numberOfLines={4}
                maxLength={250}
                inputStyles="h-24"
              />
              <Text className="text-gray-400 text-xs text-right mt-1">
                {thirdStepForm.strengths.length}/250
              </Text>

              <FormField
                title="Areas for Growth"
                value={thirdStepForm.areasOfGrowth}
                placeholder="What skills would you like to develop..."
                handleChangeText={(e) => setThirdStepForm({ ...thirdStepForm, areasOfGrowth: e })}
                otherStyles="mt-4"
                multiline
                numberOfLines={4}
                maxLength={250}
                inputStyles="h-24"
              />
              <Text className="text-gray-400 text-xs text-right mt-1">
                {thirdStepForm.areasOfGrowth.length}/250
              </Text>

              <FormField
                title="Extra Skills"
                value={thirdStepForm.extraSkills}
                placeholder="Any additional relevant skills or experiences..."
                handleChangeText={(e) => setThirdStepForm({ ...thirdStepForm, extraSkills: e })}
                otherStyles="mt-4"
                multiline
                numberOfLines={4}
                maxLength={250}
                inputStyles="h-24"
              />
              <Text className="text-gray-400 text-xs text-right mt-1">
                {thirdStepForm.extraSkills.length}/250
              </Text>
            </View>

            {/* Additional Information Section */}
            <View className="bg-black-100 rounded-2xl p-5 mb-4">
              <Text className="text-gray-100 text-xs font-pmedium mb-4 uppercase">
                Additional Information
              </Text>
              <FormField
                title="Anything Else We Should Know?"
                value={thirdStepForm.additionalInfo}
                placeholder="Share any other relevant information..."
                handleChangeText={(e) => setThirdStepForm({ ...thirdStepForm, additionalInfo: e })}
                multiline
                numberOfLines={4}
                maxLength={250}
                inputStyles="h-24"
              />
              <Text className="text-gray-400 text-xs text-right mt-1">
                {thirdStepForm.additionalInfo.length}/250
              </Text>
            </View>
          </ScrollView>
        </ProgressStep>
      </ProgressSteps>
    </SafeAreaView>
  );
};

export default Application;
