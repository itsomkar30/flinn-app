import { View, Text } from 'react-native'
import { useFonts } from "expo-font"
import React from 'react'
import { Slot, Stack } from 'expo-router'

export default function RootLayout() {
useFonts({
    'outfit': require('../../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('../../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('../../assets/fonts/Outfit-Bold.ttf')
  })
  return (
    <Slot/>
  )
}