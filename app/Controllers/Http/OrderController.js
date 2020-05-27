"use strict";
const Order = use("App/Models/Order");
const Product = use("App/Models/Product");
const Client = use("App/Models/Client");
const Address = use("App/Models/Address");
const Item = use("App/Models/Item");
const Transaction = use("App/Models/Transaction");
const Cashier = use("App/Models/Cashier");

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
    const channel =  Ws.getChannel("order").topic("order");

    if(channel){
      channel.broadcastToAll("listOrders", orders);
    }
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

    const openedCashier = await Cashier.openedCashier();
    if(!openedCashier)
      return response.status(401).json({error: true, message: "Não foi possível executar o pedido, pois o caixa está fechado!"});

    order.status = "production";
    order.client_id = client.id;
    order.observation = body["observation"];
    order.cashier_id = openedCashier.id;
    order.payment_type_id = body['payment_type_id']
    order.amount = body['amount']
    let result = await order.save();
    await order.items().createMany(body['items'])

    if (!result) {
      return response.status(401).json({error: true});
    }
    await this.broadcastOrders();
    return response.json(order);
  }

  async update({ request, response, params }) {
    const { status, motoboy_id } = request.except("_csrf");
    let order = await Order.findOrFail(params.id);
    const openedCashier = await Cashier.openedCashier();

    let transaction = new Transaction();

    order.status = status;
    order.motoboy_id = motoboy_id;
    order.cashier_id = openedCashier.id;
    const result = await order.save();
    await this.broadcastOrders();

    if (status == 'delivered') {
      transaction.payment_type_id = order.payment_type_id;
      // transaction.discount = order.discount;
      transaction.value = order.amount;
      transaction.status = 'input';
      transaction.cashier_id = openedCashier.id;
      await order.transaction().save(transaction);
      this.broadcastUpdateCashier();

    }
    return response.json(result);
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


  async broadcastUpdateCashier() {
    const channel = await Ws.getChannel("cashier").topic("cashier");
    let cashier = await Cashier.openedCashier();
    if(cashier){
      let transactions = await cashier.transactions().fetch();
      cashier.transactions = transactions.toJSON()
      cashier.total = await cashier.sumTotal();
      cashier.inputs = await cashier.sumInputs();
      cashier.outputs = await cashier.sumOutputs();
      cashier.sales = await cashier.sumSales();
      cashier.totalOrders = await cashier.countOrders();
    }

    console.log(channel)
    if(channel){
      channel.broadcastToAll("currentCashier", cashier);
    }
  }

}


module.exports = OrderController;
