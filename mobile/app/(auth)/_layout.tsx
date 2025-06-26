import { RootState } from "@/store";
import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";

export default function AuthRoutesLayout() {
    const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth);

    if (accessToken && refreshToken) {
        return <Redirect href="/" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}