import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { registerPushToken } from '../api/authApi';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

type UsePushNotificationsOptions = {
  userId?: number | null;
  onOrderTap?: (orderId: string) => void;
};

export function usePushNotifications(options: UsePushNotificationsOptions) {
  const { userId, onOrderTap } = options;
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      if (!token) return;

      setExpoPushToken(token);
      if (!userId) return;

      try {
        await registerPushToken({ userId, pushToken: token });
      } catch {
        // Keep app flow running even if token sync fails.
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((incoming) => {
      setNotification(incoming);
    });

    const handleResponse = (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as { orderId?: string | number };
      if (data?.orderId && onOrderTap) {
        onOrderTap(String(data.orderId));
      }
    };

    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) {
          handleResponse(response);
        }
      })
      .catch(() => null);

    responseListener.current = Notifications.addNotificationResponseReceivedListener(handleResponse);

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [onOrderTap, userId]);

  return { expoPushToken, notification };
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    });
  }

  if (!Device.isDevice) {
    Alert.alert('Push notifications require a physical device.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Permission needed', 'Failed to get push token for push notification.');
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  return token;
}
