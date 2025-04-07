import {
  Text,
  ScrollView,
  Alert,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import { icons } from '../../../constants';
import { useUpdateAppointmentStatusMutation } from '../../../api/individual-queries/appointments/mutations';
import { useApplication } from '../../../api/individual-queries/appointments/queries';
import StatusChip from '../../../components/StatusChip';
import { useGlobalContext } from '../../../context/GlobalProvider';
import Loader from '../../../components/Loader';
const ApplicationDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useGlobalContext();
  
  console.log(user)
  const { mutate: updateAppointmentStatus, isPending } =
    useUpdateAppointmentStatusMutation({
      onSuccess: () => {
        router.back();
      },

      onError: (error) => {
        Alert.alert('Error', error.message);
      },
    });

  const { data: applicationData } = useApplication({id }); 
  const application = applicationData?.data;
  const handleApprove = () => {
    updateAppointmentStatus({
      id,
      params:{
        status: 'accepted',
      },
    });
  };
  const handleReject = () => {
    updateAppointmentStatus({
      id,
      params:{
        status: 'rejected',
      }
    });
  };

  if (!application) {
    return (
      <Loader isLoading={isPending} />
    );
  }

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
          <StatusChip status={application.status}/>
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
              {application.references[0].name}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Relationship:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.references[0].relationship}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Phone Number:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.references[0].phoneNumber}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Email Address:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.references[0].emailAddress}
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
              {application.references[1].name}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Relationship:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.references[1].relationship}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Phone Number:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.references[1].phoneNumber}
            </Text>
          </View>

          <View className="flex-col items-start gap-1 mb-2 ml-2">
            <Text className="text-white font-pbold">Email Address:</Text>
            <Text className="text-gray-100 font-psemibold">
              {application.references[1].emailAddress}
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
      {user?.role === 'admin' && (
        <View className="flex-row items-center gap-2">
          <CustomButton
            title="Reject"
            handlePress={handleReject}
            containerStyle="mt-7 bg-status-rejected flex-1"
            textStyle="text-white"
            isLoading={isPending}
          />
          <CustomButton
            title="Approve"
            handlePress={handleApprove}
            containerStyle="mt-7 bg-status-accepted flex-1"
            textStyle="text-white"
            isLoading={isPending}
          />
        </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ApplicationDetail;
