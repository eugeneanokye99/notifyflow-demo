class NotificationChannel {
  constructor(name) {
    this.name = name;
  }

  async send() {
    throw new Error('send must be implemented by subclasses');
  }
}

module.exports = {
  NotificationChannel
};
