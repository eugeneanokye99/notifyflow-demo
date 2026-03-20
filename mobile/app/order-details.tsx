import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchOrders } from '../src/api/orderApi';
import { Order } from '../src/types';

export default function OrderDetailsScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const orders = await fetchOrders();
      const foundOrder = orders.find((item) => String(item.id) === String(orderId));
      setOrder(foundOrder || null);
      setLoading(false);
    };

    run().catch(() => {
      setOrder(null);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text>Order not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Order #{order.id}</Text>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{order.description}</Text>

        <Text style={styles.label}>Status</Text>
        <Text style={[styles.value, styles.capitalize]}>{order.status}</Text>

        <Text style={styles.label}>Created</Text>
        <Text style={styles.value}>{new Date(order.createdAt).toLocaleString()}</Text>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    gap: 6
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4
  },
  label: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4
  },
  value: {
    color: '#0f172a',
    fontSize: 16
  },
  capitalize: {
    textTransform: 'capitalize'
  }
});
