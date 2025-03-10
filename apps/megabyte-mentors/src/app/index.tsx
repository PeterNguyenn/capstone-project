import { ScrollView, Text, View, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../constants'
import CustomButton from '../components/CustomButton'
import { Redirect, router } from 'expo-router'
import { useGlobalContext } from '../context/GlobalProvider'

const App = () => {
  const { loading , isLoggedIn } = useGlobalContext();
  if(!loading && isLoggedIn) return <Redirect href={'/home'} />
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full items-center justify-center min-h-[85vh] px-4">
          <Image source={images.logo} className='w-[130px] h-[84px]' resizeMode='contain' />
          <Image source={images.cards} className='max-w-[380px] w-full h-[300px]' resizeMode='contain' />

          <View className='relative mt-5'>
            <Text className='text-white text-3xl font-bold text-center'>
              Discover Endless Possibilities with {" "} <Text className='text-secondary' testID="heading">Megabyte Mentors</Text>
            </Text>
          </View>

          <CustomButton title="Continue with Email" handlePress={() => {
            router.push('sign-in')
          }} containerStyle='w-full mt-7' />
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor={'#161622'} />
    </SafeAreaView>
  )
}

export default App