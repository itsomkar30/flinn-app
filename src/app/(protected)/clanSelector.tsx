import { View, Text, TextInput, FlatList, Pressable, Image, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { colors } from '../../../constants/colors';
import groups from '../../../assets/data/groups.json';
import { selectedClanAtom } from '../../atoms';
import { useSetAtom } from 'jotai';
import { Group } from '../../types';

export default function GroupSelector() {
    const [searchValue, setSearchValue] = useState<string>("")
    const setClan = useSetAtom(selectedClanAtom)

    const onClanSelected = (clan: Group) => {
        setClan(clan)
        router.back()
    }

    const searchClanByName = groups.filter((group) => group.name.toLowerCase().includes(searchValue.toLowerCase()))
    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1, paddingHorizontal: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                <Ionicons name="close-sharp" size={28} color="black" onPress={() => router.back()} />
                <Text style={{ fontSize: 16, fontFamily: 'outfit-bold', color: colors.textPrimary, textAlign: 'center', flex: 1, paddingRight: 28 }}>Post to</Text>

            </View>

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
                    data={searchClanByName}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => onClanSelected(item)}
                            style={{ flexDirection: 'row', marginBottom: 10, gap: 10, alignItems: 'center' }}>
                            <Image source={{ uri: item?.image }} style={{ height: 40, aspectRatio: 1, borderRadius: 40 }} />
                            <Text style={{ fontFamily: 'outfit-medium' }} >{item?.name}</Text>
                        </Pressable>
                    )}
                />

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}