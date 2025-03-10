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

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Apply to Become Mentor
        </Text>
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

        {/* Academic Information */}
        <FormField
          title="Program of Study"
          value={form.programOfStudy}
          placeholder="Enter your current program of study..."
          handleChangeText={(e) => setForm({ ...form, programOfStudy: e })}
          otherStyles="mt-6"
        />

        <FormField
          title="Current Term"
          value={form.currentTerm}
          placeholder="Enter your current term/semester..."
          handleChangeText={(e) => setForm({ ...form, currentTerm: e })}
          otherStyles="mt-6"
        />

        <FormField
          title="Number of Terms in Program"
          value={form.numberOfTermsInProgram}
          placeholder="Enter total number of terms in your program..."
          handleChangeText={(e) =>
            setForm({ ...form, numberOfTermsInProgram: e })
          }
          otherStyles="mt-6"
        />

        <FormField
          title="Campus"
          value={form.campus}
          placeholder="Enter your campus location..."
          handleChangeText={(e) => setForm({ ...form, campus: e })}
          otherStyles="mt-6"
        />

        <FormField
          title="Anticipated Graduation Date"
          value={form.anticipatedGraduationDate}
          placeholder="Enter your expected graduation date..."
          handleChangeText={(e) =>
            setForm({ ...form, anticipatedGraduationDate: e })
          }
          otherStyles="mt-6"
        />

        {/* Personal Preferences */}
        <FormField
          title="Dietary Restrictions"
          value={form.dietaryRestrictions}
          placeholder="List any dietary restrictions or preferences..."
          handleChangeText={(e) => setForm({ ...form, dietaryRestrictions: e })}
          otherStyles="mt-6"
        />

        <FormField
          title="Shirt Size"
          value={form.shirtSize}
          placeholder="Enter your shirt size..."
          handleChangeText={(e) => setForm({ ...form, shirtSize: e })}
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

        {/* First Reference */}
        <FormField
          title="First Reference Name"
          value={form.firstReferenceName}
          placeholder="Enter your first reference's full name..."
          handleChangeText={(e) => setForm({ ...form, firstReferenceName: e })}
          otherStyles="mt-6"
        />

        <FormField
          title="First Reference Relationship"
          value={form.firstReferenceRelationship}
          placeholder="How do you know this reference? (e.g., Professor, Employer)..."
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

        {/* Second Reference */}
        <FormField
          title="Second Reference Name"
          value={form.secondReferenceName}
          placeholder="Enter your second reference's full name..."
          handleChangeText={(e) => setForm({ ...form, secondReferenceName: e })}
          otherStyles="mt-6"
        />

        <FormField
          title="Second Reference Relationship"
          value={form.secondReferenceRelationship}
          placeholder="How do you know this reference? (e.g., Professor, Employer)..."
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

        {/* Essay Questions */}
        <FormField
          title="Why Are You Interested?"
          value={form.whyInterested}
          placeholder="Explain why you are interested in this opportunity..."
          handleChangeText={(e) => setForm({ ...form, whyInterested: e })}
          otherStyles="mt-6"
        />

        <FormField
          title="How Will You Make a Difference?"
          value={form.makingDifference}
          placeholder="Describe how you hope to make a difference..."
          handleChangeText={(e) => setForm({ ...form, makingDifference: e })}
          otherStyles="mt-6"
        />

        <FormField
          title="Your Strengths"
          value={form.strengths}
          placeholder="List your key strengths and how they will contribute..."
          handleChangeText={(e) => setForm({ ...form, strengths: e })}
          otherStyles="mt-6"
        />

        <FormField
          title="Areas for Growth"
          value={form.areasOfGrowth}
          placeholder="Describe areas where you'd like to grow or improve..."
          handleChangeText={(e) => setForm({ ...form, areasOfGrowth: e })}
          otherStyles="mt-6"
        />

        <FormField
          title="Extra Skills"
          value={form.extraSkills}
          placeholder="List any additional skills relevant to this application..."
          handleChangeText={(e) => setForm({ ...form, extraSkills: e })}
          otherStyles="mt-6"
        />

        <FormField
          title="Additional Information"
          value={form.additionalInfo}
          placeholder="Share any other information you'd like us to know..."
          handleChangeText={(e) => setForm({ ...form, additionalInfo: e })}
          otherStyles="mt-6"
        />

        <CustomButton
          title="Submit"
          handlePress={submit}
          containerStyle="mt-7"
          isLoading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Application;
