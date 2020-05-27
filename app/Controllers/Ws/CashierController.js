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
    // console.log(cashier);
    // return cashier.toJSON();
    this.socket.emit('currentCashier', cashier);

  }
}

module.exports = CashierController
