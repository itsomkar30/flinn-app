import { Redirect, Stack, Slot, router } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { View, Text } from 'react-native'
import React from 'react'
import { colors } from '../../../constants/colors'
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'

export default function AppLayout() {
    const { isSignedIn } = useAuth()

    if (!isSignedIn) {
        return <Redirect href={'/signin'} />
    }
    return <Stack >
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='clanSelector' options={{ headerShown: false }} />
        <Stack.Screen name='post/[id]'
            options={{
                headerTitle: '',
                headerStyle: { backgroundColor: colors.appTheme },
                animation: 'slide_from_bottom',
                headerLeft: () => (
                    <Pressable onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back-ios-new" size={20} color={colors.textSecondary} />
                    </Pressable>
                ),
                headerBackButtonDisplayMode: 'minimal'


            }} />
    </Stack>
}