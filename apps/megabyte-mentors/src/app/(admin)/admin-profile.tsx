import { View, TouchableOpacity, Image, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '../../constants';
import { useApiMutation } from '../../api/hooks';
import authService from '../../api/services/auth.service';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';

const Profile = () => {
  const { setUser, setIsLoggedIn, user } = useGlobalContext();
  const { mutate: signOut } = useApiMutation(
    authService.signOut
  );

  const logout = async () => {
    await signOut(null);
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="bg-black-200 pt-8 pb-20 px-4">
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-white text-2xl font-pbold">Admin Profile</Text>
              <Text className="text-secondary text-sm font-pregular mt-1">Administrator Dashboard</Text>
            </View>
            <TouchableOpacity
              onPress={logout}
              className="bg-black-100 p-3 rounded-lg"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-5 h-5"
                tintColor="#FF9C01"
              />
            </TouchableOpacity>
          </View>

          {/* Profile Avatar Section */}
          <View className="items-center">
            <View className="w-28 h-28 border-4 border-secondary rounded-full flex justify-center items-center bg-black-100 shadow-lg">
              <Image
                source={images.profile}
                className="w-24 h-24 rounded-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-white text-2xl font-pbold mt-4">
              {user?.name ?? 'Admin'}
            </Text>
            <View className="bg-secondary px-4 py-1 rounded-full mt-2">
              <Text className="text-white text-sm font-psemibold capitalize">
                {user?.role ?? 'Administrator'}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-4 -mt-12">
          {/* Info Cards */}
          <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-4">
              ACCOUNT INFORMATION
            </Text>

            {/* Email */}
            <View className="mb-5">
              <Text className="text-gray-100 text-xs font-pregular mb-1">
                Email Address
              </Text>
              <Text className="text-white text-base font-pmedium">
                {user?.email ?? 'Not available'}
              </Text>
            </View>

            {/* Username */}
            <View className="mb-5">
              <Text className="text-gray-100 text-xs font-pregular mb-1">
                Username
              </Text>
              <Text className="text-white text-base font-pmedium">
                {user?.name ?? 'Not available'}
              </Text>
            </View>

            {/* Role */}
            <View>
              <Text className="text-gray-100 text-xs font-pregular mb-1">
                Account Type
              </Text>
              <Text className="text-white text-base font-pmedium capitalize">
                {user?.role ?? 'Not available'}
              </Text>
            </View>
          </View>

          {/* Admin Quick Actions */}
          {/* <View className="bg-black-100 rounded-2xl p-6 mb-4 shadow-lg">
            <Text className="text-gray-100 text-sm font-pmedium mb-4">
              ADMIN ACTIONS
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/admin-home')}
              className="flex-row items-center py-4 border-b border-black-200"
            >
              <View className="bg-secondary-100 p-2 rounded-lg mr-4">
                <Image
                  source={icons.home}
                  className="w-5 h-5"
                  tintColor="#FF9C01"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-white text-base font-pregular flex-1">
                Dashboard
              </Text>
              <Text className="text-gray-100">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/admin-event-list')}
              className="flex-row items-center py-4 border-b border-black-200"
            >
              <View className="bg-secondary-100 p-2 rounded-lg mr-4">
                <Image
                  source={icons.bookmark}
                  className="w-5 h-5"
                  tintColor="#FF9C01"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-white text-base font-pregular flex-1">
                Manage Events
              </Text>
              <Text className="text-gray-100">›</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4 border-b border-black-200">
              <View className="bg-secondary-100 p-2 rounded-lg mr-4">
                <Image
                  source={icons.upload}
                  className="w-5 h-5"
                  tintColor="#FF9C01"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-white text-base font-pregular flex-1">
                User Management
              </Text>
              <Text className="text-gray-100">›</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4">
              <View className="bg-secondary-100 p-2 rounded-lg mr-4">
                <Image
                  source={icons.play}
                  className="w-5 h-5"
                  tintColor="#FF9C01"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-white text-base font-pregular flex-1">
                System Settings
              </Text>
              <Text className="text-gray-100">›</Text>
            </TouchableOpacity>
          </View> */}

          {/* Logout Button */}
          <TouchableOpacity
            onPress={logout}
            className="bg-red-500/10 border border-red-500 rounded-2xl p-4 mb-8"
          >
            <Text className="text-red-500 text-center text-base font-psemibold">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
