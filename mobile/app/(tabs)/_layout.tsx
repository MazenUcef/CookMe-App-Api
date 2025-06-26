import { StyleSheet } from 'react-native'
import React from 'react'
import { Redirect, Stack, Tabs } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'

export default function TabsLayout() {
    const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth)
    if (!accessToken || !refreshToken) return <Redirect href={'/(auth)/signIn'} />
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600"
                },
                // headerStyle: {
                //     backgroundColor: COLORS.background,
                //     borderBottomColor: COLORS.border,
                //     borderBottomWidth: 1
                // }
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: "Recipes",
                    tabBarIcon: ({ color, size }) => <Ionicons name='restaurant' size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='search'
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, size }) => <Ionicons name='search' size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='favorites'
                options={{
                    title: "Favorites",
                    tabBarIcon: ({ color, size }) => <Ionicons name='heart' size={size} color={color} />
                }}
            />
        </Tabs>
    )
}

const styles = StyleSheet.create({})