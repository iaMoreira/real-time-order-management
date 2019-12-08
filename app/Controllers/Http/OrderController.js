"use strict";
const Order = use("App/Models/Order");
const Product = use("App/Models/Product");
const Client = use("App/Models/Client");
const Address = use("App/Models/Address");
const Item = use("App/Models/Item");
const Payment = use("App/Models/Payment");

const Ws = use("Ws");
const Route = use("Route");

class OrderController {
  constructor() {}

  async index({ request, response, view }) {
    let breadcrumb = [
      {
        name: "Pedidos",
        url: Route.url("/orders"),
        icon: "fa-shopping-cart",
        class: "",
        content: ""
      },
      {
        name: "Em produção",
        url: "javascript:void(0)",
        icon: "",
        class: "active",
        content: "<span>dffd</span>"
      }
    ];
    view.share({
      title: "Pedidos em produção",
      breadcrumb: breadcrumb
    });
    return view.render("order.index");
  }

  async broadcastOrders() {
    let orders = await Order.getAll();
    await Ws.getChannel("order")
      .topic("order")
      .socket.broadcastToAll("listOrders", orders);
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
    const body = request.post();
    let order = new Order();
    let client = await this.createOrGetClient(body);
    let items = body['items'];
    let payment = new Payment();

    order.status = "production";
    order.client_id = client.id;
    order.observation = body["observation"];
    let result = await order.save();
    await order.items().createMany(body['items'])
    // items.map(function(item){});
    payment.payment_type_id = body['payment_type_id']
    payment.discount = body['discount']
    await order.payment().save(payment);

    if (order) {
      await this.broadcastOrders();
    }
    response.json(order);
    // response.route('DashboardController.index')
  }
  async update({ request, response, params }) {
    let { status, motoboy_id } = request.except("_csrf");
    const order = await Order.findOrFail(params.id);
    order.status = status;
    order.motoboy_id = motoboy_id;
    const result = await order.save();
    await this.broadcastOrders();
    if (result) {
    }
    return response.json(result);
    // response.route('DashboardController.index')
  }

  async createOrGetClient(body){
    let client;
    // console.log(body)
    if (body["client_id"]) {
      client = await Client.find(body["client_id"]);
    }else if(body['phone']){
      client = await Client.findBy('phone', body["phone"]);
    }
    if (client == null) {
      client = new Client()
      client.name = body["name"];
      client.phone = body["phone"];
      let resultClient = await client.save();
      if (resultClient) {
        let address = new Address();
        address.address = body["address"];
        address.number = body["number"];
        address.complement = body["complement"];
        await client.address().save(address);
      }else{
        abort(404);
      }
      return client;
    }
    
    return client;
    
  }
}


module.exports = OrderController;
