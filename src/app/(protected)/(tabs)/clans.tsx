import { View, Text, TextInput, FlatList, Pressable, Image, KeyboardAvoidingView, ActivityIndicator, Platform } from 'react-native'
import React, { useState } from 'react'
import { Tables } from '../../../types/database.types'
import { useSupabase } from '../../../lib/supabase'
import { useQuery } from '@tanstack/react-query';
import { fetchGroups } from '../../../services/groupFetchingService'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { colors } from '../../../../constants/colors';

type Group = Tables<"groups">


export default function ClanScreen() {
  const [searchValue, setSearchValue] = useState<string>("")
  const supabase = useSupabase()

  const { data, isLoading, error } = useQuery({
    queryKey: ['groups', { searchValue }],
    queryFn: () => fetchGroups(searchValue, supabase),
    staleTime: 5_000,
    placeholderData: (previousData) => previousData
  })




  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'outfit' }}>Failed to load groups</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: 'white', flex: 1, paddingHorizontal: 10 }}>


      {/* Search bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          marginVertical: 10,
          backgroundColor: colors.appPrimary,
          borderRadius: 5,
          paddingHorizontal: 10
        }} >
          <Ionicons name="search" size={24} color="grey" />
          <TextInput placeholder="Search for clan"
            style={{ fontFamily: 'outfit', paddingVertical: 10, flex: 1 }}
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
          />
          {searchValue && (
            <Ionicons name="close-sharp" size={24} color="grey" onPress={() => setSearchValue("")} />
          )}


        </View>


        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View

              style={{ flexDirection: 'row', marginBottom: 10, gap: 10, alignItems: 'center' }}>
              <Image source={{ uri: item?.image }} style={{ height: 40, aspectRatio: 1, borderRadius: 40 }} />
              <Text style={{ fontFamily: 'outfit-medium' }} >{item?.name}</Text>
            </View>
          )}
        />

      </KeyboardAvoidingView>
    </View>
  )
}