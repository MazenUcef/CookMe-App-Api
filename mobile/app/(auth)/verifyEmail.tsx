import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";

interface VerifyEmailProps {
    email: string;
    onBack: () => void;
}

const { height } = Dimensions.get("window");
const VerifyEmail = ({ email, onBack }: VerifyEmailProps) => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerification = async () => {
        if (!isLoaded) return;

        setLoading(true);
        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

            if (signUpAttempt.status === "complete") {
                await setActive({ session: signUpAttempt.createdSessionId });
            } else {
                Alert.alert("Error", "Verification failed. Please try again.");
                console.error(JSON.stringify(signUpAttempt, null, 2));
            }
        } catch (err: any) {
            Alert.alert("Error", err.errors?.[0]?.message || "Verification failed");
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={authStyles.keyboardView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Image Container */}
                    <View style={authStyles.imageContainer}>
                        <Image
                            source={require("../../assets/images/i3.png")}
                            style={authStyles.image}
                            contentFit="contain"
                        />
                    </View>

                    {/* Title */}
                    <Text style={authStyles.title}>Verify Your Email</Text>
                    <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {email}</Text>

                    <View style={authStyles.formContainer}>
                        {/* Verification Code Input */}
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter verification code"
                                placeholderTextColor={COLORS.textLight}
                                value={code}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Verify Button */}
                        <TouchableOpacity
                            style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                            onPress={handleVerification}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>{loading ? "Verifying..." : "Verify Email"}</Text>
                        </TouchableOpacity>

                        {/* Back to Sign Up */}
                        <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
                            <Text style={authStyles.linkText}>
                                <Text style={authStyles.link}>Back to Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};
export default VerifyEmail;

const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    imageContainer: {
        height: height * 0.3,
        marginBottom: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 320,
        height: 320,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.text,
        textAlign: "center",
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: "center",
        marginBottom: 30,
    },
    formContainer: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
        position: "relative",
    },
    textInput: {
        fontSize: 16,
        color: COLORS.text,
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: COLORS.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    eyeButton: {
        position: "absolute",
        right: 16,
        top: 16,
        padding: 4,
    },
    authButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 30,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.white,
        textAlign: "center",
    },
    linkContainer: {
        alignItems: "center",
        paddingBottom: 20,
    },
    linkText: {
        fontSize: 16,
        color: COLORS.textLight,
    },
    link: {
        color: COLORS.primary,
        fontWeight: "600",
    },
})