import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { useApiMutation } from '../../api/hooks'
import authService from '../../api/services/auth.service'
import { ApiError } from '../../api/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const { mutate: signUp, loading } = useApiMutation(
    authService.signUp
  );

  const {setIsLoggedIn, setUser} =useGlobalContext();

  const handleSubmit = async () => {
    if(!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
    }
    try {
      const response = await signUp({
        name: form.username,
        email: form.email,
        password: form.password,
      });

      setIsLoggedIn(true);
      setUser(response.data.user);

      console.log(response);
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
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles='mt-7'
            testID='password-field'
          />

          <CustomButton title='Sign Up' handlePress={handleSubmit} containerStyle='mt-7' isLoading={loading} testID='signup-button' />
          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>Have an account already?</Text>
            <Link href='/sign-in' className='text-secondary font-psemibold text-lg'>Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp