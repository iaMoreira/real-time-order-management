"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Database = use('Database')

class Order extends Model {
  client() {
    return this.belongsTo("App/Models/Client");
  }

  motoboy() {
    return this.belongsTo("App/Models/Motoboy");
  }

  payment() {
    return this.hasOne("App/Models/Payment");
  }

  items() {
    return this.hasMany("App/Models/Item");
  }

  products() {
    return this.manyThrough("App/Models/Product", "items");
  }

  static async getAll() {
    let orders = {};
    orders["production"] = await this.query()
      .with("client")
      .with("items.product")
      .innerJoin('items', 'orders.id', 'items.order_id')
      .innerJoin('products', 'products.id', 'items.product_id')
      .where("orders.status", "production")
      .select('orders.*', Database.raw('SUM((products.price * items.amount)) AS total'))
      .groupBy('orders.id')
      .fetch();

    orders["delivery"] = await this.query()
      .with("client")
      .with("motoboy")
      .innerJoin('items', 'orders.id', 'items.order_id')
      .innerJoin('products', 'products.id', 'items.product_id')
      .where("status", "delivery")
      .select('orders.*', Database.raw('SUM((products.price * items.amount)) AS total'))
      .groupBy('orders.id')      
      .fetch();

    orders["delivered"] = await this.query()
      .with("client")
      .with("motoboy")
      .innerJoin('items', 'orders.id', 'items.order_id')
      .innerJoin('products', 'products.id', 'items.product_id')
      .where("status", "delivered")
      .select('orders.*', Database.raw('SUM((products.price * items.amount)) AS total'))
      .groupBy('orders.id')      
      .fetch();

    orders["canceled"] = await this.query()
      .with("client")
      .with("motoboy")
      .innerJoin('items', 'orders.id', 'items.order_id')
      .innerJoin('products', 'products.id', 'items.product_id')
      .where("status", "canceled")
      .select('orders .*', Database.raw('SUM((products.price * items.amount)) AS total'))
      .groupBy('orders.id')      
      .fetch();
    return orders;
  }
}

module.exports = Order;
