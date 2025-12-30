import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { colors } from '../../../constants/colors'

export default function Verify2FA() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()
    const [code, setCode] = React.useState('')

    React.useEffect(() => {
        if (signIn && signIn.status === 'needs_second_factor') {
            const prepareCode = async () => {
                try {
                    await signIn.prepareSecondFactor({ strategy: 'email_code' })
                } catch (err) {
                    console.error('Error preparing 2FA:', err)
                }
            }
            prepareCode()
        }
    }, [])

    const onVerifyPress = async () => {
        if (!isLoaded) return
        try {
            const signInAttempt = await signIn.attemptSecondFactor({
                strategy: 'email_code',
                code
            })
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/(protected)/(tabs)/')
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.text}>Check your email for the verification code</Text>
            <TextInput
                style={styles.input}
                value={code}
                placeholder="Verification Code"
                placeholderTextColor="#aaa"
                onChangeText={setCode}
            />
            <Pressable style={styles.button} onPress={onVerifyPress}>
                <Text style={styles.buttonText}>Verify</Text>
            </Pressable>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: colors.appPrimary,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: colors.textPrimary,
    },
    text: {
        fontSize: 16,
        color: "grey",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "lightgrey",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: "white",
    },
    button: {
        backgroundColor: colors.appTheme,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
})