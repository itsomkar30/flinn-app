import { View, Text } from 'react-native'
import React from 'react'
import { colors } from '../../../../constants/colors'

export default function InboxScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{
        fontFamily: 'outfit-medium',
        fontSize: 18,
        color: colors.textPrimary
      }}>Notifications is currently empty</Text>
    </View>
  )
}