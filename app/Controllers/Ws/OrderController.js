'use strict'
const Order = use("App/Models/Order");

class OrderController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
    console.log(socket.id)
    this.onListOrders()
  }
  
  async onListOrders(){
    
    let orders = await Order.getAll()
    console.log(orders)
    this.socket.emit('listOrders', orders);
  }

}

module.exports = OrderController
