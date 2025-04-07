import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const ApplicationRoute = () => {
  return (
    <>
     <Stack >
        <Stack.Screen name="application-detail/[id]" options={{ headerShown: false }} />
     </Stack>
     <StatusBar style="light" backgroundColor={'#161622'} />
    </>
  )
}

export default ApplicationRoute