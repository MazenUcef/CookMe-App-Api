import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function TabsLayout() {
    const { isSignedIn } = useAuth()
    if (!isSignedIn) return <Redirect href={'/(auth)/signIn'} />
    return (
        <Stack />
    )
}

const styles = StyleSheet.create({})