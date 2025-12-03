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
import { useUpdateApplicationStatusMutation } from '../../../api/individual-queries/applications/mutations';
import { useApplication } from '../../../api/individual-queries/applications/queries';
import StatusChip from '../../../components/StatusChip';
import { useGlobalContext } from '../../../context/GlobalProvider';
import Loader from '../../../components/Loader';


const ApplicationDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useGlobalContext();
  
  console.log(user)
  const { mutate: updateApplicationStatus, isPending } =
    useUpdateApplicationStatusMutation({
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
    updateApplicationStatus({
      id,
      params:{
        status: 'accepted',
      },
    });
  };
  const handleReject = () => {
    updateApplicationStatus({
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
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="bg-black-200 pt-6 pb-8 px-4">
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-black-100 p-3 rounded-lg"
            >
              <Image
                source={icons.leftArrow}
                resizeMode="contain"
                className="w-5 h-5"
                tintColor="#FF9C01"
              />
            </TouchableOpacity>
            <Text className="text-xl text-white font-pbold">
              Application Details
            </Text>
            <StatusChip status={application.status}/>
          </View>

          {/* Applicant Header */}
          <View className="items-center mt-4">
            <View className="w-24 h-24 bg-secondary-100 rounded-full items-center justify-center mb-3">
              <Text className="text-white text-4xl font-pbold text-center" style={{ lineHeight: 48 }}>
                {application.studentName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-white text-2xl font-pbold">
              {application.studentName}
            </Text>
            <Text className="text-gray-100 text-base font-pregular mt-1">
              {application.studentNumber}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-4 -mt-4">
          {/* Contact Information Card */}
          <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-5 uppercase">
              Contact Information
            </Text>
            <View className="mb-5">
              <Text className="text-gray-100 text-sm font-pregular mb-2">Email</Text>
              <Text className="text-white text-base font-pmedium">
                {application.emailAddress}
              </Text>
            </View>
            <View className="mb-5">
              <Text className="text-gray-100 text-sm font-pregular mb-2">Phone</Text>
              <Text className="text-white text-base font-pmedium">
                {application.phoneNumber}
              </Text>
            </View>
            {application.alternateNumber && (
              <View className="mb-5">
                <Text className="text-gray-100 text-sm font-pregular mb-2">Alternate Phone</Text>
                <Text className="text-white text-base font-pmedium">
                  {application.alternateNumber}
                </Text>
              </View>
            )}
            <View>
              <Text className="text-gray-100 text-sm font-pregular mb-2">Address</Text>
              <Text className="text-white text-base font-pmedium">
                {application.address}
              </Text>
            </View>
          </View>

          {/* Academic Information Card */}
          <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-5 uppercase">
              Academic Information
            </Text>
            <View className="mb-5">
              <Text className="text-gray-100 text-sm font-pregular mb-2">Program of Study</Text>
              <Text className="text-white text-base font-pmedium">
                {application.programOfStudy}
              </Text>
            </View>
            <View className="mb-5">
              <Text className="text-gray-100 text-sm font-pregular mb-2">Campus</Text>
              <Text className="text-white text-base font-pmedium capitalize">
                {application.campus}
              </Text>
            </View>
            <View className="flex-row gap-4 mb-5">
              <View className="flex-1">
                <Text className="text-gray-100 text-sm font-pregular mb-2">Current Term</Text>
                <Text className="text-white text-base font-pmedium">
                  {application.currentTerm}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-100 text-sm font-pregular mb-2">Total Terms</Text>
                <Text className="text-white text-base font-pmedium">
                  {application.numberOfTermsInProgram}
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-gray-100 text-sm font-pregular mb-2">Graduation Date</Text>
              <Text className="text-white text-base font-pmedium">
                {application.anticipatedGraduationDate}
              </Text>
            </View>
          </View>

          {/* Additional Details Card */}
          <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-5 uppercase">
              Additional Details
            </Text>
            <View className="mb-5">
              <Text className="text-gray-100 text-sm font-pregular mb-2">Shirt Size</Text>
              <Text className="text-white text-base font-pmedium">
                {application.shirtSize}
              </Text>
            </View>
            {application.dietaryRestrictions && (
              <View className="mb-5">
                <Text className="text-gray-100 text-sm font-pregular mb-2">Dietary Restrictions</Text>
                <Text className="text-white text-base font-pmedium">
                  {application.dietaryRestrictions}
                </Text>
              </View>
            )}
            {application.accommodationsRequired && (
              <View>
                <Text className="text-gray-100 text-sm font-pregular mb-2">Accommodations Required</Text>
                <Text className="text-white text-base font-pmedium">
                  {application.accommodationsRequired}
                </Text>
              </View>
            )}
          </View>

          {/* References Card */}
          <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-5 uppercase">
              Professional References
            </Text>

            {/* First Reference */}
            <View className="mb-6">
              <Text className="text-secondary text-base font-psemibold mb-4">
                First Reference
              </Text>
              <View className="mb-4">
                <Text className="text-gray-100 text-sm font-pregular mb-2">Name</Text>
                <Text className="text-white text-base font-pmedium">
                  {application.references[0].name}
                </Text>
              </View>
              <View className="mb-4">
                <Text className="text-gray-100 text-sm font-pregular mb-2">Relationship</Text>
                <Text className="text-white text-base font-pmedium">
                  {application.references[0].relationship}
                </Text>
              </View>
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-gray-100 text-sm font-pregular mb-2">Phone</Text>
                  <Text className="text-white text-base font-pmedium">
                    {application.references[0].phoneNumber}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-100 text-sm font-pregular mb-2">Email</Text>
                  <Text className="text-white text-base font-pmedium">
                    {application.references[0].emailAddress}
                  </Text>
                </View>
              </View>
            </View>

            <View className="border-t border-gray-700 my-5" />

            {/* Second Reference */}
            <View>
              <Text className="text-secondary text-base font-psemibold mb-4">
                Second Reference
              </Text>
              <View className="mb-4">
                <Text className="text-gray-100 text-sm font-pregular mb-2">Name</Text>
                <Text className="text-white text-base font-pmedium">
                  {application.references[1].name}
                </Text>
              </View>
              <View className="mb-4">
                <Text className="text-gray-100 text-sm font-pregular mb-2">Relationship</Text>
                <Text className="text-white text-base font-pmedium">
                  {application.references[1].relationship}
                </Text>
              </View>
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-gray-100 text-sm font-pregular mb-2">Phone</Text>
                  <Text className="text-white text-base font-pmedium">
                    {application.references[1].phoneNumber}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-100 text-sm font-pregular mb-2">Email</Text>
                  <Text className="text-white text-base font-pmedium">
                    {application.references[1].emailAddress}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Motivation & Goals Card */}
          <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-5 uppercase">
              Motivation & Goals
            </Text>
            <View className="mb-5">
              <Text className="text-secondary text-base font-psemibold mb-3">
                Why Are You Interested?
              </Text>
              <Text className="text-white text-base font-pregular leading-6">
                {application.whyInterested}
              </Text>
            </View>
            <View>
              <Text className="text-secondary text-base font-psemibold mb-3">
                How Will You Make a Difference?
              </Text>
              <Text className="text-white text-base font-pregular leading-6">
                {application.makingDifference}
              </Text>
            </View>
          </View>

          {/* Skills & Development Card */}
          <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-5 uppercase">
              Skills & Development
            </Text>
            <View className="mb-5">
              <Text className="text-secondary text-base font-psemibold mb-3">
                Strengths
              </Text>
              <Text className="text-white text-base font-pregular leading-6">
                {application.strengths}
              </Text>
            </View>
            <View className="mb-5">
              <Text className="text-secondary text-base font-psemibold mb-3">
                Areas for Growth
              </Text>
              <Text className="text-white text-base font-pregular leading-6">
                {application.areasOfGrowth}
              </Text>
            </View>
            <View className="mb-5">
              <Text className="text-secondary text-base font-psemibold mb-3">
                Additional Skills
              </Text>
              <Text className="text-white text-base font-pregular leading-6">
                {application.extraSkills}
              </Text>
            </View>
            {application.additionalInfo && (
              <View>
                <Text className="text-secondary text-base font-psemibold mb-3">
                  Additional Information
                </Text>
                <Text className="text-white text-base font-pregular leading-6">
                  {application.additionalInfo}
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons - Admin Only */}
          {user?.role === 'admin' && application.status === 'pending' && (
            <View className="flex-row gap-3 mb-8">
              <CustomButton
                title="Reject"
                handlePress={handleReject}
                containerStyle="flex-1 bg-red"
                textStyle="text-white"
                isLoading={isPending}
              />
              <CustomButton
                title="Approve"
                handlePress={handleApprove}
                containerStyle="flex-1 bg-green"
                textStyle="text-white"
                isLoading={isPending}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ApplicationDetail;
