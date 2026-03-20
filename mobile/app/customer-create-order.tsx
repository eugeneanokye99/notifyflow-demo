import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { createOrder } from '../src/api/orderApi';
import { useSessionStore } from '../src/store/useSessionStore';

export default function CustomerCreateOrderScreen() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSessionStore((state) => state.user);
  const clearUser = useSessionStore((state) => state.clearUser);

  const submitOrder = async () => {
    if (!user?.id) {
      router.replace('/role-select');
      return;
    }

    const text = description.trim();
    if (!text) {
      Alert.alert('Description required', 'Please enter an order description.');
      return;
    }

    try {
      setLoading(true);
      const order = await createOrder({ customerId: user.id, description: text });
      setDescription('');
      Alert.alert('Order created', `Order #${order.id} submitted.`);
      router.push({ pathname: '/order-details', params: { orderId: String(order.id) } });
    } catch (error: any) {
      Alert.alert('Could not create order', error?.response?.data?.error || 'Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Order</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2 coffees"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Pressable style={styles.primaryButton} onPress={submitOrder} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? 'Submitting...' : 'Submit Order'}</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/notifications')}>
          <Text style={styles.secondaryButtonText}>View Notifications</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            clearUser();
            router.replace('/role-select');
          }}>
          <Text style={styles.secondaryButtonText}>Switch User</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 12
  },
  title: {
    fontSize: 22,
    fontWeight: '700'
  },
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top'
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '600'
  }
});
