'use strict'
const Order = use("App/Models/Order");
const Product = use("App/Models/Product");
const Ws = use('Ws')

class OrderController {
  constructor () {
  }
  async broadcastOrders(){
    // this.socket = await Ws.getChannel('order').topic('order').socket
    let orders = await Order.getAll()       
      Ws.getChannel('order').topic('order')
        .socket.emit('listOrders', orders)
  }
  async create({ request, response, view }) {
    let products = await Product.query()
    .with("group")
    .fetch();
    return view.render("order.create", {  
        products: products.toJSON()
    });
  }

  async store({ request, response }) {
    let input = request.except('_csrf')
    input['client_id'] = '1'; 
    input['status'] = 'production'; 
    const order = await Order.create(input);
    if(order){
      await this.broadcastOrders()
    }
    response.route('DashboardController.index')
  }
  async update({ request, response,params }) {
    let {status, motoboy_id}= request.except('_csrf')
    const order = await Order.findOrFail(params.id)
    order.status = status;
    order.motoboy_id = motoboy_id;
    const result = await order.save();
    await this.broadcastOrders()
    if(result){
    }
    return response.json(result)  
    // response.route('DashboardController.index')
  }
}

module.exports = OrderController
