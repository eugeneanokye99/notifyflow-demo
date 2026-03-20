import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { router, Stack, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSessionStore } from '../src/store/useSessionStore';
import { setPresence } from '../src/api/presenceApi';
import { usePushNotifications } from '../src/hooks/usePushNotifications';
import { InAppToastHost } from '../src/notifications/InAppToastHost';

export default function RootLayout() {
  const rootNavigationState = useRootNavigationState();
  const user = useSessionStore((state: any) => state.user);
  const appStateRef = useRef(AppState.currentState);

  usePushNotifications({
    userId: user?.id,
    onOrderTap: (orderId) => {
      if (!rootNavigationState?.key) return;
      router.push({
        pathname: '/order-details',
        params: { orderId }
      });
    }
  });

  useEffect(() => {
    if (!user?.id) return undefined;

    setPresence({ userId: user.id, isActive: true }).catch(() => null);

    const heartbeatId = setInterval(() => {
      if (appStateRef.current === 'active') {
        setPresence({ userId: user.id, isActive: true }).catch(() => null);
      }
    }, 12000);

    const subscription = AppState.addEventListener('change', (nextState) => {
      appStateRef.current = nextState;
      const isActive = nextState === 'active';
      setPresence({ userId: user.id, isActive }).catch(() => null);
    });

    return () => {
      clearInterval(heartbeatId);
      subscription.remove();
      setPresence({ userId: user.id, isActive: false }).catch(() => null);
    };
  }, [user?.id]);

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="role-select" options={{ title: 'NotifyFlow Demo' }} />
        <Stack.Screen name="customer-create-order" options={{ title: 'Create Order' }} />
        <Stack.Screen name="staff-orders" options={{ title: 'Staff Orders' }} />
        <Stack.Screen name="order-details" options={{ title: 'Order Details' }} />
        <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      </Stack>
      <InAppToastHost userId={user?.id} />
      <StatusBar style="auto" />
    </>
  );
}
