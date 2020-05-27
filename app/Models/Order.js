"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Database = use('Database')
const Cashier = use('App/Models/Cashier');

class Order extends Model {
  client() {
    return this.belongsTo("App/Models/Client");
  }

  motoboy() {
    return this.belongsTo("App/Models/Motoboy");
  }

  transaction() {
    return this.hasOne("App/Models/Transaction");
  }

  cashier() {
    return this.hasOne("App/Models/Cashier");
  }

  items() {
    return this.hasMany("App/Models/Item");
  }

  products() {
    return this.manyThrough("App/Models/Product", "items");
  }

  static async getAll() {
    let orders = {};
    let cashier = await Cashier.openedCashier();
    if(!cashier){
      return orders
    }
    orders["production"] = await this.query()
      .with("client")
      .with("items.product")
      .innerJoin('items', 'orders.id', 'items.order_id')
      .innerJoin('products', 'products.id', 'items.product_id')
      .where("orders.status", "production")
      .where('orders.cashier_id', cashier.id)
      .select('orders.*', Database.raw('SUM((products.price * items.amount)) AS total'))
      .groupBy('orders.id')
      .fetch();

    orders["delivery"] = await this.query()
      .with("client")
      .with("motoboy")
      .innerJoin('items', 'orders.id', 'items.order_id')
      .innerJoin('products', 'products.id', 'items.product_id')
      .where("status", "delivery")
      .where('orders.cashier_id', cashier.id)
      .select('orders.*', Database.raw('SUM((products.price * items.amount)) AS total'))
      .groupBy('orders.id')
      .fetch();

    orders["delivered"] = await this.query()
      .with("client")
      .with("motoboy")
      .innerJoin('items', 'orders.id', 'items.order_id')
      .innerJoin('products', 'products.id', 'items.product_id')
      .where("status", "delivered")
      .where('orders.cashier_id', cashier.id)
      .select('orders.*', Database.raw('SUM((products.price * items.amount)) AS total'))
      .groupBy('orders.id')
      .fetch();

    orders["canceled"] = await this.query()
      .with("client")
      .with("motoboy")
      .innerJoin('items', 'orders.id', 'items.order_id')
      .innerJoin('products', 'products.id', 'items.product_id')
      .where("status", "canceled")
      .where('orders.cashier_id', cashier.id)
      .select('orders .*', Database.raw('SUM((products.price * items.amount)) AS total'))
      .groupBy('orders.id')
      .fetch();
    return orders;
  }

  static async sumTotal() {
    result = await this.query()
    .leftJoin('items', 'orders.id', 'items.order_id')
    .leftJoin('products', 'products.id', 'items.product_id')
    .where("orders.id", this.id)
    .select(Database.raw('SUM((products.price * items.amount)) AS total'))
    .groupBy('orders.id')
    .fetch();

    return result.total;
  }
}

module.exports = Order;
