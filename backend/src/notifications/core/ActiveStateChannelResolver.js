class ActiveStateChannelResolver {
  constructor({ activeChannel = 'in-app', inactiveChannel = 'push', activeWithinMs = 0 } = {}) {
    this.activeChannel = activeChannel;
    this.inactiveChannel = inactiveChannel;
    this.activeWithinMs = Number(activeWithinMs) || 0;
  }

  isRecentlyActive(recipient) {
    if (!recipient?.lastSeenAt || this.activeWithinMs <= 0) {
      return false;
    }

    const lastSeenAtMs = new Date(recipient.lastSeenAt).getTime();
    if (Number.isNaN(lastSeenAtMs)) {
      return false;
    }

    return Date.now() - lastSeenAtMs <= this.activeWithinMs;
  }

  getResolution({ recipient }) {
    const isActiveNow = Boolean(recipient?.isActive);
    const isRecent = this.isRecentlyActive(recipient);
    const isActiveByGrace = !isActiveNow && isRecent;
    const shouldTreatAsActive = isActiveNow || isRecent;

    return {
      channel: shouldTreatAsActive ? this.activeChannel : this.inactiveChannel,
      reason: isActiveNow
        ? 'active_flag'
        : isActiveByGrace
          ? 'active_grace_window'
          : 'inactive'
    };
  }

  resolve({ recipient }) {
    return this.getResolution({ recipient }).channel;
  }
}

module.exports = {
  ActiveStateChannelResolver
};
