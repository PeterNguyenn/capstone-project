import { View, TouchableOpacity, Image, } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '../../constants';
import { useApiMutation } from '../../api/hooks';
import authService from '../../api/services/auth.service';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import InfoBox from '../../components/InfoBox';

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
      <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={images.profile}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.name ?? ''}
              containerStyles="mt-10"
              titleStyles="text-lg"
            />
            <InfoBox
              title={user?.email ?? ''}
              containerStyles="mt-3"
              titleStyles="text-lg"
            />
            <InfoBox
              title={user?.role ?? ''}
              containerStyles="mt-3"
              titleStyles="text-lg"
            />
          </View>
    </SafeAreaView>
  );
};

export default Profile;
