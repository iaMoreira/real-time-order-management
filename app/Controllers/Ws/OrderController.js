'use strict'

class OrderController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onProduction (order) {
    this.socket.broadcastToAll('production', order)
  }
}

module.exports = OrderController
