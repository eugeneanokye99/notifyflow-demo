import * as Notifications from 'expo-notifications';

function extractOrderIdFromResponse(response: Notifications.NotificationResponse | null) {
  const data = response?.notification?.request?.content?.data as { orderId?: string | number };
  if (!data?.orderId) return null;
  return String(data.orderId);
}

export function registerNotificationTapHandler(onOrderTap: (orderId: string) => void) {
  if (typeof onOrderTap !== 'function') {
    return () => {};
  }

  Notifications.getLastNotificationResponseAsync()
    .then((response) => {
      const orderId = extractOrderIdFromResponse(response);
      if (orderId) {
        onOrderTap(orderId);
      }
    })
    .catch(() => null);

  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const orderId = extractOrderIdFromResponse(response);
    if (orderId) {
      onOrderTap(orderId);
    }
  });

  return () => {
    subscription.remove();
  };
}
