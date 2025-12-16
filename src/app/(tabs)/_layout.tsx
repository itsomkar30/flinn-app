import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../../../constants/colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';



export default function TabLayout() {
    return (
        <Tabs screenOptions={{
             headerStyle: {
                backgroundColor: colors.dark,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarStyle: {
                backgroundColor: colors.dark
            }
        }}>
            <Tabs.Screen name="index" options={{
                title: "Home",

                headerTitleAlign: "center",
                headerTintColor: colors.primary,
                headerTitleStyle: {
                    fontFamily: "outfit",
                },
                tabBarIcon: ({ color }) => <AntDesign name="home" size={20} color={color} />
            }} />


            <Tabs.Screen name="chat" options={{
                title: "Chat",
                headerTitleAlign: "center",
                headerTintColor: colors.primary,
                headerTitleStyle: {
                    fontFamily: "outfit",
                },
                tabBarIcon: ({ color }) => <Feather name="users" size={20} color={color} />
            }} />

            <Tabs.Screen name="create" options={{
                title: "Create",
                headerTitleAlign: "center",
                headerTintColor: colors.primary,
                headerTitleStyle: {
                    fontFamily: "outfit",
                },
                tabBarIcon: ({ color }) => <AntDesign name="plus-circle" size={20} color={color} />
            }} />


            <Tabs.Screen name="clans" options={{
                title: "Clans",
                headerTitleAlign: "center",
                headerTintColor: colors.primary,
                headerTitleStyle: {
                    fontFamily: "outfit",
                },
                tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses-outline" size={20} color={color} />
            }} />


            <Tabs.Screen name="inbox" options={{
                title: "Inbox",
                headerTitleAlign: "center",
                headerTintColor: colors.primary,
                headerTitleStyle: {
                    fontFamily: "outfit",
                },
                tabBarIcon: ({ color }) => <Feather name="bell" size={20} color={color} />
            }} />



        </Tabs>
    )
}