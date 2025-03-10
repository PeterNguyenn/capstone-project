import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { useApiMutation } from '../../api/hooks'
import authService from '../../api/services/auth.service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ApiError } from '../../api/utils'


const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const { mutate: signIn, loading } = useApiMutation(
    authService.signIn
  );

  const handleSubmit = async () => {
    if(!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
    }
    try {
      const response = await signIn(form);
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
          <Image source={images.logo} className='w-[115px] h-[35px]' resizeMode='contain' />
          <Text className='text-white text-2xl font-psemibold text-semibold mt-10'>
            Login To Megabyte Mentors
            </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mt-7'
            keyboardType='email-address'
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles='mt-7'
          />

          <CustomButton title='Sign In' handlePress={handleSubmit} containerStyle='mt-7' isLoading={loading} />
          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>Don't have an account?</Text>
            <Link href='/sign-up' className='text-secondary font-psemibold text-lg'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn