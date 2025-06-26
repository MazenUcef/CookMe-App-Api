import { Stack, Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function MainLayout() {
    const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth);

    if (!accessToken || !refreshToken) {
        return <Redirect href="/signIn" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" />
        </Stack>
    );
}