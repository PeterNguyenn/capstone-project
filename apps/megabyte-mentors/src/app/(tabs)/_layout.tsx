import { View, Image, ImageProps } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from '../../constants' 

const TabIcon = ({icon, color, name, focused}: {icon: ImageProps, color: string, name: string, focused: boolean}) => {
  return (
    <View className='flex items-center justify-center gap-2'>
      <Image source={icon} resizeMode='contain' tintColor={color} className="w-8 h-6" />
      {/* <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}>
        {name}
      </Text> */}
    </View>
  )
}

const TabsLayout = () => {
  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle:{
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84
          }
          // tabBarShowLabel: false,
        }}>
        <Tabs.Screen name="home" options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
          )
        }} />
      
        <Tabs.Screen name="application" options={{
          title: 'Application',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.bookmark} color={color} name="Application" focused={focused} />
          )
        }} />
        {/* <Tabs.Screen name="create" options={{
          title: 'Create',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.plus} color={color} name="Create" focused={focused} />
          )
        }} /> */}
        <Tabs.Screen name="profile" options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
          )
        }} />
      </Tabs>
  )
}

export default TabsLayout