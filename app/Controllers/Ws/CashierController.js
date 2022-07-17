'use strict'

const Cashier = use('App/Models/Cashier');

class CashierController {
  constructor ({ socket, request }) {
    this.socket = socket;
    this.request = request;
    // console.log(socket.id)
    this.onCurrentCashier()

  }

  async onCurrentCashier() {

    let cashierOpened = await Cashier.openedCashier();

    let data = {};
    data.cashiers = await Cashier.query().where('status', 'closed').fetch();

    if(cashierOpened){
      let transactions = await cashierOpened.transactions().fetch();
      data.transactions = transactions.toJSON()
      data.total = await cashierOpened.sumTotal();
      data.inputs = await cashierOpened.sumInputs();
      data.outputs = await cashierOpened.sumOutputs();
      data.sales = await cashierOpened.sumSales();
      data.totalOrders = await cashierOpened.countOrders();
    }
    this.socket.emit('currentCashier', data);

  }
}

module.exports = CashierController
