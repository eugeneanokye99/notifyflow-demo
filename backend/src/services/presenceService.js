const { getUserById } = require('./authService');

function setUserPresence(userId, isActive) {
  const user = getUserById(userId);
  if (!user) {
    const error = new Error('user not found');
    error.status = 404;
    throw error;
  }

  user.isActive = Boolean(isActive);
  user.lastSeenAt = new Date().toISOString();

  return user;
}

module.exports = {
  setUserPresence
};
