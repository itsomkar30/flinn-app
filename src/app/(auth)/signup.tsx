import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, Pressable, KeyboardAvoidingView, Button, StyleSheet, Platform } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { colors } from '../../../constants/colors'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                username,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }


    if (pendingVerification) {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <Text style={styles.title}>Verify Your Email</Text>
                <TextInput
                    style={styles.input}
                    value={code}
                    placeholder="Enter your verification code"
                    placeholderTextColor="#aaa"
                    onChangeText={setCode}
                />
                <Button title="Verify" onPress={onVerifyPress} />
            </KeyboardAvoidingView>
        )
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter email"
                placeholderTextColor="#aaa"
                onChangeText={setEmailAddress}
            />
            <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={username}
                placeholder="Username"
                placeholderTextColor="#aaa"
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                value={password}
                placeholder="Enter password"
                placeholderTextColor="#aaa"
                secureTextEntry
                onChangeText={setPassword}
            />
            <Pressable style={styles.button} onPress={onSignUpPress}>
                <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
        </KeyboardAvoidingView>
    )






    //     if (pendingVerification) {
    //         return (
    //             <>
    //                 <Text>Verify your email</Text>
    //                 <TextInput
    //                     value={code}
    //                     placeholder="Enter your verification code"
    //                     onChangeText={(code) => setCode(code)}
    //                 />
    //                 <TouchableOpacity onPress={onVerifyPress}>
    //                     <Text>Verify</Text>
    //                 </TouchableOpacity>
    //             </>
    //         )
    //     }

    //     return (
    //         <View>
    //             <>
    //                 <Text>Sign up</Text>
    //                 <TextInput
    //                     autoCapitalize="none"
    //                     value={emailAddress}
    //                     placeholder="Enter email"
    //                     onChangeText={(email) => setEmailAddress(email)}
    //                 />
    //                 <TextInput
    //                     value={password}
    //                     placeholder="Enter password"
    //                     secureTextEntry={true}
    //                     onChangeText={(password) => setPassword(password)}
    //                 />
    //                 <TouchableOpacity onPress={onSignUpPress}>
    //                     <Text>Continue</Text>
    //                 </TouchableOpacity>
    //                 <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
    //                     <Text>Already have an account?</Text>
    //                     <Link href="/signin">
    //                         <Text>Sign in</Text>
    //                     </Link>
    //                 </View>
    //             </>
    //         </View>
    //     )
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
});