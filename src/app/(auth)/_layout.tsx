import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'


export default function AuthLayout() {
    const { isSignedIn } = useAuth()

    if (isSignedIn) {
        return <Redirect href={'/'} />
    }
    
    return (
        <Stack />
    )
}