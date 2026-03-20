import { Redirect } from 'expo-router';
import { useSessionStore } from '../src/store/useSessionStore';
import { ROLES } from '../src/utils/constants';

export default function IndexScreen() {
  const user = useSessionStore((state) => state.user);

  if (!user) {
    return <Redirect href="/role-select" />;
  }

  if (user.role === ROLES.CUSTOMER) {
    return <Redirect href="/customer-create-order" />;
  }

  return <Redirect href="/staff-orders" />;
}
