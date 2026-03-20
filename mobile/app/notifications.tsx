import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { router, useRootNavigationState } from 'expo-router';
import { fetchInAppNotifications } from '../src/api/presenceApi';
import { useInAppNotificationsStore } from '../src/notifications/inAppNotificationsStore';
import { useSessionStore } from '../src/store/useSessionStore';

export default function NotificationsScreen() {
  const rootNavigationState = useRootNavigationState();
  const user = useSessionStore((state) => state.user);
  const notifications = useInAppNotificationsStore((state) => state.notifications);
  const setNotifications = useInAppNotificationsStore((state) => state.setNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    const items = await fetchInAppNotifications(user.id);
    setNotifications(items);
  }, [setNotifications, user?.id]);

  useEffect(() => {
    if (!rootNavigationState?.key) {
      return;
    }

    if (!user?.id) {
      router.replace('/role-select');
      return;
    }

    loadNotifications().catch(() => null);
    const intervalId = setInterval(() => {
      loadNotifications().catch(() => null);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [loadNotifications, rootNavigationState?.key, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadNotifications();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No in-app notifications yet.</Text>}
        contentContainerStyle={notifications.length === 0 ? styles.emptyContainer : styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/order-details',
                params: { orderId: String((item.data as any)?.orderId || '') }
              })
            }>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
          </Pressable>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>In-app notifications appear here when user is active.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc'
  },
  listContent: {
    gap: 10,
    paddingBottom: 16
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  empty: {
    color: '#64748b'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12
  },
  title: {
    fontWeight: '700',
    marginBottom: 4
  },
  message: {
    color: '#1f2937',
    marginBottom: 6
  },
  time: {
    color: '#64748b',
    fontSize: 12
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10
  },
  footerText: {
    color: '#475569',
    fontSize: 12
  }
});
