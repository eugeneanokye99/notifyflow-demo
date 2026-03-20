function createNotificationEngine({ resolveChannel, channels }) {
  if (typeof resolveChannel !== 'function') {
    throw new Error('resolveChannel must be a function');
  }

  if (!channels || typeof channels !== 'object') {
    throw new Error('channels must be an object');
  }

  async function dispatch({ recipient, payload }) {
    if (!recipient) {
      return { delivered: false, reason: 'missing_recipient' };
    }

    const channelName = resolveChannel({ recipient, payload });
    const channel = channels[channelName];

    if (!channel || typeof channel.send !== 'function') {
      return {
        delivered: false,
        reason: 'unknown_channel',
        channel: channelName || null
      };
    }

    return channel.send({ recipient, payload });
  }

  return {
    dispatch
  };
}

module.exports = {
  createNotificationEngine
};
