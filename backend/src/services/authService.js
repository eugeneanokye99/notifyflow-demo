const store = require('../data/store');

function normalizeRole(role) {
  if (!role) return null;
  const value = String(role).trim().toLowerCase();
  return value === 'customer' || value === 'staff' ? value : null;
}

function registerOrLogin({ name, role }) {
  const normalizedRole = normalizeRole(role);
  if (!name || !normalizedRole) {
    const error = new Error('name and valid role are required');
    error.status = 400;
    throw error;
  }

  let user = store.users.find(
    (item) => item.name.toLowerCase() === String(name).toLowerCase() && item.role === normalizedRole
  );

  if (!user) {
    user = {
      id: store.nextUserId++,
      name: String(name).trim(),
      role: normalizedRole,
      isActive: false,
      pushToken: null,
      createdAt: new Date().toISOString()
    };
    store.users.push(user);
  }

  return user;
}

function getUserById(userId) {
  return store.users.find((user) => user.id === Number(userId));
}

function savePushToken(userId, pushToken) {
  const user = getUserById(userId);
  if (!user) {
    const error = new Error('user not found');
    error.status = 404;
    throw error;
  }

  user.pushToken = pushToken || null;
  return user;
}

module.exports = {
  registerOrLogin,
  getUserById,
  savePushToken
};
