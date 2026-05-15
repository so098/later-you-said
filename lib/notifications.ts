import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
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
    const body = "저장만 해놓고 도망간 거, 이제 볼 시간.";

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

    const currentPermission = await Notifications.getPermissionsAsync();
    const finalPermission = currentPermission.granted
      ? currentPermission
      : await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });

    if (!finalPermission.granted) {
      Alert.alert("알림 권한이 꺼져 있어", "기기 설정에서 알림 권한을 허용해줘.");
      return;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
        interruptionLevel: "active",
        data: { source: "dev-test" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(Date.now() + 3000),
      },
    });

    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    Alert.alert(
      "3초 알림 예약됨",
      `예약 ID: ${notificationId}\n대기 중인 알림: ${scheduledNotifications.length}개\n앱을 잠깐 백그라운드로 보내고 기다려봐.`,
    );
  } catch (error) {
    console.error(error);
    Alert.alert(
      "알림 테스트 실패",
      error instanceof Error ? error.message : "알 수 없는 오류가 났어.",
    );
  }
}
