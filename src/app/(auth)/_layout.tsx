import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack, router } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { MaterialIcons } from '@expo/vector-icons'
import { Pressable } from 'react-native';




export default function AuthLayout() {
    const { isSignedIn } = useAuth()

    if (isSignedIn) {
        return <Redirect href={'/'} />
    }

    return (
        <Stack>
            <Stack.Screen name='signin' options={{ title: 'Sign in', headerTitleAlign: 'center' }} />
            <Stack.Screen name='signup' options={{
                title: 'Sign up', headerTitleAlign: 'center', headerLeft: () => (
                    <Pressable onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back-ios-new" size={20} color="#000" />
                    </Pressable>
                ),
            }} />

            <Stack.Screen name='2fa' options={{ title: 'Two Factor Authentication', headerTitleAlign: 'center' }} />
        </Stack>
    )
}