import { View, Text, Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../../../constants/colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { selectedClanAtom } from '../../../atoms';
import { Link, router } from 'expo-router'
import { useAtom } from 'jotai'

export default function CreateScreen() {

  const [title, setTitle] = useState<string>("")
  const [postText, setPostText] = useState<string>("")
  const [clan, setClan] = useAtom(selectedClanAtom)

  return (
    <SafeAreaView style={{ backgroundColor: colors.appPrimary, flex: 1, paddingHorizontal: 10 }}>

      {/* Header */}

      <View style={{ flexDirection: 'row', alignItems: 'center' }} >
        <Ionicons name="close-sharp" size={28} color="black" onPress={() => router.back()} />
        <Pressable style={{ marginLeft: 'auto' }} >
          <Text style={styles.postButton} >Post</Text>
        </Pressable>
      </View>

      {/* Select Clans Section */}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 10 }}>

          <Link href={"clanSelector"} asChild>
            <Pressable style={styles.clanContainer}>
              {clan ? (
                <>
                  <Image source={{ uri: clan.image }}
                    style={{ height: 20, aspectRatio: 1, borderRadius: 20 }} />

                  <Text style={{ fontFamily: 'outfit-medium' }}>{clan.name}</Text>
                </>
              ) :
                (
                  <>
                    <Text style={styles.cStyle}>c/</Text>
                    <Text style={{ fontFamily: 'outfit-medium' }}>Select a clan</Text>
                  </>
                )}

            </Pressable>
          </Link>

          {/* Create Post Section Inputs*/}

          <TextInput placeholder='Title'
            value={title}
            onChangeText={(text) => setTitle(text)}
            style={{ fontSize: 20, fontFamily: 'outfit-bold', letterSpacing: 0.7 }}
            multiline
            scrollEnabled={false} />



          <TextInput placeholder='Post text (optional)'
            value={postText}
            onChangeText={(text) => setPostText(text)}
            style={{ fontSize: 16, fontFamily: 'outfit', letterSpacing: 0.7 }}
            multiline
            scrollEnabled={false} />

        </ScrollView>

      </KeyboardAvoidingView>



    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  postButton: {
    fontFamily: "outfit-medium",
    paddingVertical: 2.5,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: colors.textSecondary,
    backgroundColor: 'grey'

  },
  clanContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#EDEDED',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start'



  },
  cStyle: {
    fontFamily: 'outfit-medium',
    backgroundColor: colors.appSecondary,
    color: colors.textSecondary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 99



  }


})