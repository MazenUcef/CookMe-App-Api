import { Slot } from "expo-router";
import { Provider } from "react-redux";
import store from "@/store";
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </Provider>
  );
}
