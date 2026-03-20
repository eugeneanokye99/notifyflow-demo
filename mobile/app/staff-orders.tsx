import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { router, useRootNavigationState } from 'expo-router';
import { fetchOrders, updateOrderStatus } from '../src/api/orderApi';
import { useOrderStore } from '../src/store/useOrderStore';
import { useSessionStore } from '../src/store/useSessionStore';
import { ORDER_STATUS } from '../src/utils/constants';
import { Order } from '../src/types';

export default function StaffOrdersScreen() {
  const rootNavigationState = useRootNavigationState();
  const user = useSessionStore((state) => state.user);
  const clearUser = useSessionStore((state) => state.clearUser);
  const setSelectedOrderId = useOrderStore((state) => state.setSelectedOrderId);
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async () => {
    const nextOrders = await fetchOrders();
    setOrders(nextOrders);
  }, []);

  useEffect(() => {
    if (!rootNavigationState?.key) {
      return;
    }

    if (!user?.id) {
      router.replace('/role-select');
      return;
    }

    loadOrders().catch(() => null);
    const intervalId = setInterval(() => {
      loadOrders().catch(() => null);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [loadOrders, rootNavigationState?.key, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadOrders();
    } finally {
      setRefreshing(false);
    }
  };

  const updateStatus = async (orderId: number, status: 'accepted' | 'ready') => {
    if (!user?.id) return;

    try {
      await updateOrderStatus({ orderId, staffId: user.id, status });
      await loadOrders();
    } catch (error: any) {
      Alert.alert('Update failed', error?.response?.data?.error || 'Try again.');
    }
  };

  const openOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    router.push({ pathname: '/order-details', params: { orderId: String(orderId) } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Incoming Orders</Text>
        <Pressable style={styles.linkButton} onPress={() => router.push('/notifications')}>
          <Text style={styles.linkButtonText}>Notifications</Text>
        </Pressable>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No orders yet.</Text>}
        contentContainerStyle={orders.length === 0 ? styles.emptyContainer : styles.listContent}
        renderItem={({ item }) => (
          <Pressable style={styles.orderCard} onPress={() => openOrder(item.id)}>
            <Text style={styles.orderTitle}>Order #{item.id}</Text>
            <Text style={styles.orderText}>{item.description}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            <View style={styles.actionRow}>
              <Pressable
                style={styles.actionButton}
                onPress={() => updateStatus(item.id, ORDER_STATUS.ACCEPTED)}>
                <Text style={styles.actionButtonText}>Accepted</Text>
              </Pressable>
              <Pressable style={styles.actionButton} onPress={() => updateStatus(item.id, ORDER_STATUS.READY)}>
                <Text style={styles.actionButtonText}>Ready</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />

      <Pressable
        style={styles.switchButton}
        onPress={() => {
          clearUser();
          router.replace('/role-select');
        }}>
        <Text style={styles.switchButtonText}>Switch User</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#f8fafc'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 22,
    fontWeight: '700'
  },
  linkButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0f766e'
  },
  linkButtonText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  listContent: {
    paddingBottom: 16,
    gap: 10
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#64748b'
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10
  },
  orderTitle: {
    fontWeight: '700',
    marginBottom: 4
  },
  orderText: {
    color: '#111827',
    marginBottom: 6
  },
  status: {
    color: '#334155',
    marginBottom: 8,
    textTransform: 'capitalize'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8
  },
  actionButton: {
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  switchButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12
  },
  switchButtonText: {
    color: '#0f172a',
    fontWeight: '600'
  }
});
