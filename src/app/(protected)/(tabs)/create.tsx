import { View, Text, Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../../../constants/colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Ionicons';
import { selectedClanAtom } from '../../../atoms';
import { Link, router } from 'expo-router'
import { useAtom } from 'jotai'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Database, TablesInsert } from '../../../types/database.types';
import { goBack } from 'expo-router/build/global-state/routing';
import { useSupabase } from '../../../lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { uploadImage } from '../../../services/supabaseImageService';
import { insertPost } from '../../../services/postFetchingService';



export default function CreateScreen() {

  const [title, setTitle] = useState<string>("")
  const [postText, setPostText] = useState<string>("")
  const [image, setImage] = useState<string | null>(null);
  const [clan, setClan] = useAtom(selectedClanAtom)
  const queryClient = useQueryClient()
  const { user } = useUser();
  const supabase = useSupabase()




  const { mutate, isPending, data, error } = useMutation({
    mutationFn: (image: string | undefined) => {
      if (!clan) {
        throw new Error("Please select a clan")
      }
      if (!title) {
        throw new Error("Title is required")
      }

      return insertPost({
        title,
        description: postText,
        group_id: clan.id,
        image
      },
        supabase
      )
    },
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      goBack();

    },

    onError: (error) => {
      console.log(error)
      Alert.alert("Failed to post", error.message)
    }
  })

  console.log(error)

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onPostClick = async () => {
    let imagePath = image ? await uploadImage(image, supabase) : undefined



    mutate(imagePath)
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.appPrimary, flex: 1, paddingHorizontal: 10 }}>

      {/* Header */}

      <View style={{ flexDirection: 'row', alignItems: 'center' }} >
        <Ionicons name="close-sharp" size={28} color="black" onPress={() => router.back()} />
        <Pressable
          onPress={() => onPostClick()}
          disabled={isPending}
          style={{ marginLeft: 'auto' }} >
          <Text style={styles.postButton} >
            {isPending ? "Posting.." : "Post"}
          </Text>
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

          {image &&

            <View style={{ paddingVertical: 20 }}>
              <Ionicons name="close-sharp"
                size={18}
                color="white"
                onPress={() => setImage(null)}
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  right: 10,
                  top: 30,
                  padding: 3,
                  backgroundColor: '#00000090',
                  borderRadius: 20
                }}
              />

              <Image
                source={{ uri: image }}
                style={{ width: "100%", aspectRatio: 1, borderRadius: 4 }}
              />
            </View>
          }

          <TextInput placeholder='Post text (optional)'
            value={postText}
            onChangeText={(text) => setPostText(text)}
            style={{ fontSize: 16, fontFamily: 'outfit', letterSpacing: 0.7 }}
            multiline
            scrollEnabled={false} />

        </ScrollView>
        {/* FOOTER */}
        <Pressable onPress={pickImage} style={{ flexDirection: 'row', gap: 20, padding: 10, alignItems: "center", }}>
          <Feather name="image" size={24} color="black" onPress={pickImage} />
          <Text style={{ fontFamily: "outfit-medium" }} >Click here to add photo</Text>
        </Pressable>

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