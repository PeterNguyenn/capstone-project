
import { SplashScreen, Stack } from "expo-router";
import "../../global.css";

import { useFonts } from "expo-font";
import { useEffect } from "react";
import GlobalProvider from "../context/GlobalProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "../context/NotificationProvider";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../../assets/fonts/Poppins-Thin.ttf"),
  });
  const queryClient = new QueryClient();

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if(!fontsLoaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <NotificationProvider>
          <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(application)" options={{ headerShown: false }} />
              {/* <Stack.Screen name="/search/[query]" options={{ headerShown: false }} /> */}
              {/* <Stack.Screen name="profile" options={{ headerShown: false }} /> */}
          </Stack>
        </NotificationProvider>
      </GlobalProvider>
    </QueryClientProvider>
  );
}
export default RootLayout;