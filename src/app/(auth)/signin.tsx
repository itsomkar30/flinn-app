import { useAuth, useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Pressable, Button, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { colors } from '../../../constants/colors'

export default function Page() {

    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded) return

        console.log('Attempting sign in with:', emailAddress)

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            console.log('Sign in attempt status:', signInAttempt.status)

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                console.log('Sign in successful, redirecting...')
                router.replace('/(protected)/(tabs)/')
            } else if (signInAttempt.status === 'needs_second_factor') {
                // Handle 2FA by navigating to verification screen
                router.push('/2fa')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.log('Sign in incomplete:', JSON.stringify(signInAttempt, null, 2))
                alert('Sign in incomplete. Check console for details.')
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error('Sign in error:', JSON.stringify(err, null, 2))
            alert(`Sign in failed: ${err.errors?.[0]?.message || err.message || 'Unknown error'}`)
        }
    }

    return (

        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Text style={styles.title}>Sign In</Text>
            <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Email"
                placeholderTextColor="#aaa"
                onChangeText={setEmailAddress}
            />
            <TextInput
                style={styles.input}
                value={password}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                onChangeText={setPassword}
            />
            <Pressable style={styles.button} onPress={onSignInPress}>
                <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>
            <View style={styles.signUpContainer}>
                <Text style={styles.text}>Don't have an account?</Text>
                <Link href="/signup" asChild>
                    <TouchableOpacity>
                        <Text style={styles.signUpText}> Sign up</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </KeyboardAvoidingView>



        // <View>
        //     <Text>Sign in</Text>
        //     <TextInput
        //         autoCapitalize="none"
        //         value={emailAddress}
        //         placeholder="Enter email"
        //         onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        //     />
        //     <TextInput
        //         value={password}
        //         placeholder="Enter password"
        //         secureTextEntry={true}
        //         onChangeText={(password) => setPassword(password)}
        //     />
        //     <TouchableOpacity onPress={onSignInPress}>
        //         <Text>Continue</Text>
        //     </TouchableOpacity>
        //     <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
        //         <Link href="/signup">
        //             <Text>Sign up</Text>
        //         </Link>



        //     </View>
        // </View>
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
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "lightgrey",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: "white",
        color: colors.textPrimary,
    },
    signUpContainer: {
        flexDirection: "row",
        marginTop: 15,
    },
    text: {
        fontSize: 16,
        color: "grey",
    },
    signUpText: {
        fontSize: 16,
        color: colors.appTheme,
        fontWeight: "bold",
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