const EventEmitter = require('events');

const eventBus = new EventEmitter();

const EVENTS = {
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_UPDATED: 'ORDER_UPDATED'
};

module.exports = {
  eventBus,
  EVENTS
};
