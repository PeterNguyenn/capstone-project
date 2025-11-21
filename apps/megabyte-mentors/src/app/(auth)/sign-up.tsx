import { View, Text, ScrollView, Image, Alert, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useApiMutation } from '../../api/hooks'
import authService from '../../api/services/auth.service'
import { ApiError } from '../../api/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useGlobalContext } from '../../context/GlobalProvider'
import { useNotifications } from '../../context/NotificationProvider'

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasSpecialChar: false
  })

  const { mutate: signUp, loading } = useApiMutation(
    authService.signUp
  );

  const {setIsLoggedIn, setUser} =useGlobalContext();
  const {updateUserToken, isInitialized} = useNotifications();

  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setPasswordRequirements(requirements);
    return requirements;
  };

  const handlePasswordChange = (password: string) => {
    setForm({ ...form, password });
    validatePassword(password);
  };

  const handleSubmit = async () => {
    if(!form.username || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if(form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const requirements = validatePassword(form.password);
    if(!requirements.minLength || !requirements.hasUpperCase || !requirements.hasSpecialChar) {
      Alert.alert('Error', 'Password does not meet all requirements');
      return;
    }
    try {
      const response = await signUp({
        name: form.username,
        email: form.email,
        password: form.password,
      });

      setIsLoggedIn(true);
      setUser(response.data.user);
      if(response.data.user.role !== 'admin' && isInitialized) {
        updateUserToken(response.data.user._id);
      }

      // Store token
      await AsyncStorage.setItem('auth_token', response.data.token);
      // Navigate to home screen
      router.replace('/home');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        // Error is already captured in the hook
        console.log(err.message);
      }
    }
  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full h-full justify-center px-4 my-6 min-h-[70vh]'>
          <Image source={images.logo} className='w-[200px] h-[35px]' resizeMode='contain' />
          <Text className='text-white text-2xl font-psemibold text-semibold mt-10'>
            Sign Up
            </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles='mt-10'
            testID='username-field'
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mt-7'
            keyboardType='email-address'
            testID='email-field'
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={handlePasswordChange}
            otherStyles='mt-7'
            testID='password-field'
          />

          {form.password.length > 0 && (
            <View className='mt-3 px-2'>
              <Text className='text-gray-100 text-base font-pregular mb-2'>Password must contain:</Text>
              <View className='space-y-1'>
                <Text className={`text-sm ${passwordRequirements.minLength ? 'text-green-500' : 'text-gray-400'}`}>
                  {passwordRequirements.minLength ? '✓' : '○'} At least 8 characters
                </Text>
                <Text className={`text-sm ${passwordRequirements.hasUpperCase ? 'text-green-500' : 'text-gray-400'}`}>
                  {passwordRequirements.hasUpperCase ? '✓' : '○'} One uppercase letter
                </Text>
                <Text className={`text-sm ${passwordRequirements.hasSpecialChar ? 'text-green-500' : 'text-gray-400'}`}>
                  {passwordRequirements.hasSpecialChar ? '✓' : '○'} One special character (!@#$%^&*...)
                </Text>
              </View>
            </View>
          )}

          <FormField
            title="Confirm Password"
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            otherStyles='mt-7'
            testID='confirm-password-field'
          />

          <CustomButton title='Sign Up' handlePress={handleSubmit} containerStyle='mt-7' isLoading={loading} testID='signup-button' />
          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>Have an account already?</Text>
            <Pressable onPress={() => router.back()}>
              <Text className='text-secondary font-psemibold text-lg'>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp