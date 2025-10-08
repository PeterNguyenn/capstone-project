import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const EventRoute = () => {
  return (
    <>
     <Stack >
        <Stack.Screen name="event-detail/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="create-event" options={{ headerShown: false }} />
     </Stack>
     <StatusBar style="light" backgroundColor={'#161622'} />
    </>
  )
}

export default EventRoute