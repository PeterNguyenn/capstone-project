import { Text, ScrollView, Alert, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import { isObjectFilledOut } from '../../utils/check-empty-object';
import { router } from 'expo-router';
import { ApiError } from '../../api/utils';
import { useCreateAppointmentMutation } from '../../api/individual-queries/appointments/mutations';
import { useApplications } from '../../api/individual-queries/appointments/queries';
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
  const { user } = useGlobalContext();

  const { data: applications } = useApplications(
    user?.role !== 'admin' && user?._id
      ? {
          userId: user._id,
        }
      : {}
  );

  const { mutate: createApplication, isPending } = useCreateAppointmentMutation(
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
    if (!isObjectFilledOut(firstStepForm)) {
      setError(true);
      return Alert.alert('Please provide all fields');
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
    if (!isObjectFilledOut(thirdStepForm)) {
      setError(true);
      return Alert.alert('Please provide all fields');
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
      >
        <ProgressStep
          label="Personal Information"
          onNext={onNextFirstStep}
          errors={error}
        >
            <FormField
              title="Student Name"
              value={firstStepForm.studentName}
              placeholder="Enter your full name..."
              handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, studentName: e })}
              otherStyles="mt-10"
            />
            <FormField
              title="Student Number"
              value={firstStepForm.studentNumber}
              placeholder="Enter your student ID number..."
              handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, studentNumber: e })}
              otherStyles="mt-6"
              keyboardType="numeric"
            />

            <FormField
              title="Address"
              value={firstStepForm.address}
              placeholder="Enter your current address..."
              handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, address: e })}
              otherStyles="mt-6"
            />

            <FormField
              title="Phone Number"
              value={firstStepForm.phoneNumber}
              placeholder="Enter your primary phone number..."
              handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, phoneNumber: e })}
              otherStyles="mt-6"
            />

            <FormField
              title="Alternate Number"
              value={firstStepForm.alternateNumber}
              placeholder="Enter an alternate phone number (optional)..."
              handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, alternateNumber: e })}
              otherStyles="mt-6"
              keyboardType="numeric"
            />

            <FormField
              title="Email Address"
              value={firstStepForm.emailAddress}
              placeholder="Enter your email address..."
              handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, emailAddress: e })}
              otherStyles="mt-6"
            />

            <PickerField
              data={programOptions}
              title="Program of Study"
              otherStyles="mt-6"
              handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, programOfStudy: e })}
            />

            <FormField
              title="Current Term"
              value={firstStepForm.currentTerm}
              placeholder="Enter your current term/semester..."
              handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, currentTerm: e })}
              otherStyles="mt-6"
              keyboardType="numeric"
            />

            <FormField
              title="Number of Terms in Program"
              value={firstStepForm.numberOfTermsInProgram}
              placeholder="Enter total number of terms in your program..."
              handleChangeText={(e) =>
                setFirstStepForm({ ...firstStepForm, numberOfTermsInProgram: e })
              }
              otherStyles="mt-6"
              keyboardType="numeric"
            />

            <PickerField
              data={campusOptions}
              title="Campus"
              otherStyles="mt-6"
              handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, campus: e })}
            />

            <FormField
              title="Anticipated Graduation Date"
              value={firstStepForm.anticipatedGraduationDate}
              placeholder="Enter your expected graduation date..."
              handleChangeText={(e) =>
                setFirstStepForm({ ...firstStepForm, anticipatedGraduationDate: e })
              }
              otherStyles="mt-6"
            />

            <FormField
              title="Dietary Restrictions"
              value={firstStepForm.dietaryRestrictions}
              placeholder="List any dietary restrictions or preferences..."
              handleChangeText={(e) =>
                setFirstStepForm({ ...firstStepForm, dietaryRestrictions: e })
              }
              otherStyles="mt-6"
            />

            <PickerField
              data={shirtSizes}
              title="Shirt Size"
              otherStyles="mt-6"
              handleChangeText={(e) => setFirstStepForm({ ...firstStepForm, shirtSize: e })}
            />

            <FormField
              title="Accommodations Required"
              value={firstStepForm.accommodationsRequired}
              placeholder="Describe any accommodations you may need..."
              handleChangeText={(e) =>
                setFirstStepForm({ ...firstStepForm, accommodationsRequired: e })
              }
              otherStyles="mt-6"
            />
        </ProgressStep>
        <ProgressStep
          label="References"
          buttonPreviousTextColor='#4E4E61'
          onNext={onNextSecondStep}
          errors={error}
        >
            <FormField
              title="First Reference Name"
              value={secondStepForm.firstReferenceName}
              placeholder="Enter your first reference's full name..."
              handleChangeText={(e) =>
                setSecondStepForm({ ...secondStepForm, firstReferenceName: e })
              }
              otherStyles="mt-6"
            />

            <FormField
              title="First Reference Relationship"
              value={secondStepForm.firstReferenceRelationship}
              placeholder="How do you know this reference? (e.g., Professor, Employer)..."
              handleChangeText={(e) =>
                setSecondStepForm({ ...secondStepForm, firstReferenceRelationship: e })
              }
              otherStyles="mt-6"
            />

            <FormField
              title="First Reference Phone Number"
              value={secondStepForm.firstReferencePhoneNumber}
              placeholder="Enter your first reference's phone number..."
              handleChangeText={(e) =>
                setSecondStepForm({ ...secondStepForm, firstReferencePhoneNumber: e })
              }
              otherStyles="mt-6"
            />

            <FormField
              title="First Reference Email Address"
              value={secondStepForm.firstReferenceEmailAddress}
              placeholder="Enter your first reference's email address..."
              handleChangeText={(e) =>
                setSecondStepForm({ ...secondStepForm, firstReferenceEmailAddress: e })
              }
              otherStyles="mt-6"
            />

            <FormField
              title="Second Reference Name"
              value={secondStepForm.secondReferenceName}
              placeholder="Enter your second reference's full name..."
              handleChangeText={(e) =>
                setSecondStepForm({ ...secondStepForm, secondReferenceName: e })
              }
              otherStyles="mt-6"
            />

            <FormField
              title="Second Reference Relationship"
              value={secondStepForm.secondReferenceRelationship}
              placeholder="How do you know this reference? (e.g., Professor, Employer)..."
              handleChangeText={(e) =>
                setSecondStepForm({ ...secondStepForm, secondReferenceRelationship: e })
              }
              otherStyles="mt-6"
            />

            <FormField
              title="Second Reference Phone Number"
              value={secondStepForm.secondReferencePhoneNumber}
              placeholder="Enter your second reference's phone number..."
              handleChangeText={(e) =>
                setSecondStepForm({ ...secondStepForm, secondReferencePhoneNumber: e })
              }
              otherStyles="mt-6"
            />

            <FormField
              title="Second Reference Email Address"
              value={secondStepForm.secondReferenceEmailAddress}
              placeholder="Enter your second reference's email address..."
              handleChangeText={(e) =>
                setSecondStepForm({ ...secondStepForm, secondReferenceEmailAddress: e })
              }
              otherStyles="mt-6"
            />
        </ProgressStep>
        <ProgressStep
          label="Interests"
          buttonPreviousTextColor='#4E4E61'
          onSubmit={onSubmit}
          errors={error}
        >
            <FormField
              title="Why Are You Interested?"
              value={thirdStepForm.whyInterested}
              placeholder="Explain why you are interested in this opportunity..."
              handleChangeText={(e) => setThirdStepForm({ ...thirdStepForm, whyInterested: e })}
              otherStyles="mt-6"
              multiline
              numberOfLines={4}
              maxLength={250}
              inputStyles="h-48"
            />

            <FormField
              title="How Will You Make a Difference?"
              value={thirdStepForm.makingDifference}
              placeholder="Describe how you hope to make a difference..."
              handleChangeText={(e) =>
                setThirdStepForm({ ...thirdStepForm, makingDifference: e })
              }
              otherStyles="mt-6"
              multiline
              numberOfLines={4}
              maxLength={250}
              inputStyles="h-48"
            />

            <FormField
              title="Your Strengths"
              value={thirdStepForm.strengths}
              placeholder="List your key strengths and how they will contribute..."
              handleChangeText={(e) => setThirdStepForm({ ...thirdStepForm, strengths: e })}
              otherStyles="mt-6"
              multiline
              numberOfLines={4}
              maxLength={250}
              inputStyles="h-48"
            />

            <FormField
              title="Areas for Growth"
              value={thirdStepForm.areasOfGrowth}
              placeholder="Describe areas where you'd like to grow or improve..."
              handleChangeText={(e) => setThirdStepForm({ ...thirdStepForm, areasOfGrowth: e })}
              otherStyles="mt-6"
              multiline
              numberOfLines={4}
              maxLength={250}
              inputStyles="h-48"
            />

            <FormField
              title="Extra Skills"
              value={thirdStepForm.extraSkills}
              placeholder="List any additional skills relevant to this application..."
              handleChangeText={(e) => setThirdStepForm({ ...thirdStepForm, extraSkills: e })}
              otherStyles="mt-6"
              multiline
              numberOfLines={4}
              maxLength={250}
              inputStyles="h-48"
            />

            <FormField
              title="Additional Information"
              value={thirdStepForm.additionalInfo}
              placeholder="Share any other information you'd like us to know..."
              handleChangeText={(e) => setThirdStepForm({ ...thirdStepForm, additionalInfo: e })}
              otherStyles="mt-6"
              multiline
              numberOfLines={4}
              maxLength={250}
              inputStyles="h-48"
            />
        </ProgressStep>
      </ProgressSteps>
    </SafeAreaView>
  );
};

export default Application;
