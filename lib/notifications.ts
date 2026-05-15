import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { seedItems } from "../constants/reminders";

const mainReminder = seedItems[0];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleTestNotification() {
  try {
    const title = "나중에 본다며";
    const body = `${mainReminder.pressure} · ${mainReminder.meta}`;

    if (Platform.OS === "web") {
      if (!("Notification" in globalThis)) {
        window.alert(
          "이 브라우저는 알림을 지원하지 않아. Expo Go나 실제 기기에서 확인해줘.",
        );
        return;
      }

      const permission = await globalThis.Notification.requestPermission();

      if (permission !== "granted") {
        window.alert(
          "브라우저 알림 권한이 꺼져 있어. 주소창 옆 설정에서 알림을 허용해줘.",
        );
        return;
      }

      window.setTimeout(() => {
        new globalThis.Notification(title, { body });
      }, 3000);
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("알림 권한이 꺼져 있어", "기기 설정에서 알림 권한을 허용해줘.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { itemId: mainReminder.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });
  } catch (error) {
    console.error(error);
    Alert.alert(
      "알림 테스트 실패",
      error instanceof Error ? error.message : "알 수 없는 오류가 났어.",
    );
  }
}
