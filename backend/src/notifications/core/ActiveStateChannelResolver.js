class ActiveStateChannelResolver {
  constructor({ activeChannel = 'in-app', inactiveChannel = 'push' } = {}) {
    this.activeChannel = activeChannel;
    this.inactiveChannel = inactiveChannel;
  }

  resolve({ recipient }) {
    return recipient?.isActive ? this.activeChannel : this.inactiveChannel;
  }
}

module.exports = {
  ActiveStateChannelResolver
};
