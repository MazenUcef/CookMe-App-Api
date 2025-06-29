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
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useAuthRedirect, useSignUp } from "@/api/Auth";
import { SafeAreaView } from "react-native-safe-area-context";


const { height } = Dimensions.get('window')


const SignUpScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { accessToken, signup, user, isLoading, error, refreshToken } = useSignUp()
    useAuthRedirect()

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        try {
            await signup(email, password)
        } catch (err) {
            Alert.alert("Error", error || "Sign up failed")
        }
        router.push('/(auth)/signIn')
    };

    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                style={authStyles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Image Container */}
                    <View style={authStyles.imageContainer}>
                        <Image
                            source={require("../../assets/images/i2.png")}
                            style={authStyles.image}
                            contentFit="contain"
                        />
                    </View>

                    <Text style={authStyles.title}>Create Account</Text>

                    <View style={authStyles.formContainer}>
                        {/* Email Input */}
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter email"
                                placeholderTextColor={COLORS.textLight}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter password"
                                placeholderTextColor={COLORS.textLight}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={authStyles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={COLORS.textLight}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[authStyles.authButton, isLoading && authStyles.buttonDisabled]}
                            onPress={handleSignUp}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>
                                {isLoading ? "Creating Account..." : "Sign Up"}
                            </Text>
                        </TouchableOpacity>

                        {/* Sign In Link */}
                        <TouchableOpacity style={authStyles.linkContainer} onPress={() => router.back()}>
                            <Text style={authStyles.linkText}>
                                Already have an account? <Text style={authStyles.link}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};
export default SignUpScreen;


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