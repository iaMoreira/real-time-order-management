'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class Cashier extends Model {

  transactions () {
    return this.hasMany('App/Models/Transaction');
  }

  orders () {
    return this.hasMany('App/Models/Order');
  }

  async sumTotal() {
    const sum =  await this.transactions()
      .select(Database.raw("SUM( CASE WHEN transactions.status = 'input' THEN transactions.value ELSE -transactions.value END) as total"))
      .groupBy('cashier_id')
      .first();
    if(sum)
      return sum.total;
    else
      return 0;
  }

  async sumInputs() {
      const inputs = await this.transactions()
      .where('transactions.status', 'input')
      .select(Database.raw("SUM(transactions.value) as total"))
      .groupBy('cashier_id')
      .first();

      if(inputs)
        return inputs.total;
      else
        return 0;
  }

  async sumSales() {
    const inputs = await this.transactions()
    .where('transactions.status', 'input')
    .whereNotNull('transactions.order_id')
    .select(Database.raw("SUM(transactions.value) as total"))
    .groupBy('cashier_id')
    .first();

    if(inputs)
      return inputs.total;
    else
      return 0;
  }

  async countOrders() {
    const orders = await this.orders()
    .where('orders.status', 'delivered')
    .select(Database.raw("COUNT(orders.id) as total"))
    .groupBy('cashier_id')
    .first();

    if(orders)
      return orders.total;
    else
      return 0;
  }

  async sumOutputs()   {
    const outputs = await this.transactions()
    .select(Database.raw("SUM(transactions.value) as total"))
    .where('transactions.status', 'output')
    .groupBy('cashier_id')
    .first();

    if(outputs)
      return outputs.total;
    else
      return 0;

  }

  static async openedCashier() {
    return await this.query()
      .where('status', 'opened')
      .first();
  }
}

module.exports = Cashier
