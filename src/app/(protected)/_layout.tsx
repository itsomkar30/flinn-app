import { Redirect, Stack, Slot } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { View, Text } from 'react-native'
import React from 'react'

export default function AppLayout() {
    const { isSignedIn } = useAuth()

    if (!isSignedIn) {
        return <Redirect href={'/signin'} />
    }
    return <Slot />
}