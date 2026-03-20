import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { loginWithRole } from '../src/api/authApi';
import { setPresence } from '../src/api/presenceApi';
import { useSessionStore } from '../src/store/useSessionStore';
import { ROLES } from '../src/utils/constants';
import { Role } from '../src/types';

export default function RoleSelectScreen() {
  const [name, setName] = useState('');
  const [loadingRole, setLoadingRole] = useState<Role | null>(null);
  const setUser = useSessionStore((state) => state.setUser);

  const login = async (role: Role) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }

    try {
      setLoadingRole(role);
      const user = await loginWithRole({ name: trimmedName, role });
      setUser(user);
      await setPresence({ userId: user.id, isActive: true });

      if (role === ROLES.CUSTOMER) {
        router.replace('/customer-create-order');
      } else {
        router.replace('/staff-orders');
      }
    } catch (error: any) {
      Alert.alert('Login failed', error?.response?.data?.error || 'Could not continue.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>NotifyFlow Demo</Text>
        <Text style={styles.subtitle}>Choose your role to test smart notifications.</Text>

        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Pressable
          style={[styles.button, styles.customerButton]}
          onPress={() => login(ROLES.CUSTOMER)}
          disabled={Boolean(loadingRole)}>
          <Text style={styles.buttonText}>
            {loadingRole === ROLES.CUSTOMER ? 'Starting...' : 'Continue as Customer'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.staffButton]}
          onPress={() => login(ROLES.STAFF)}
          disabled={Boolean(loadingRole)}>
          <Text style={styles.buttonText}>
            {loadingRole === ROLES.STAFF ? 'Starting...' : 'Continue as Staff'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f3f4f6'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    gap: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '700'
  },
  subtitle: {
    color: '#4b5563'
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  customerButton: {
    backgroundColor: '#2563eb'
  },
  staffButton: {
    backgroundColor: '#0f766e'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600'
  }
});
