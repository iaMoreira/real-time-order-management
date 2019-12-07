'use strict'
const Order = use("App/Models/Order");

class OrderController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
    this.onListOrders()
  }
  
  async onListOrders(){
    
    let orders = await Order.getAll()
    this.socket.emit('listOrders', orders);
  }

}

module.exports = OrderController
