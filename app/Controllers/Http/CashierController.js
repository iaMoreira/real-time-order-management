'use strict'

const Cashier = use('App/Models/Cashier');
const Transaction = use("App/Models/Transaction");
const Ws = use("Ws");

class CashierController {

  async open({request, response, route,  view}) {

    const cashier = await Cashier.openedCashier();
    if(cashier){
      view.share({
        errorMessage: "Caixa ainda está aberto!",
      });
    }else {
      const data = {status: 'opened'};

      const cashier = await Cashier.create(data);

      view.share({
        cashier,
        successMessage: 'Caixa aberto com sucesso!'
      });
    }
    this.broadcastUpdateCashier();

    return response.route('cashier.index');
  }

  async close({response, view}){
    let openedCashier = await Cashier.openedCashier();

    if(!openedCashier){
      view.share({
        errorMessage: "Caixa já está fechado!",
      });
    }else {

      openedCashier.total = await openedCashier.sumTotal();
      openedCashier.inputs = await openedCashier.sumInputs();
      openedCashier.outputs = await openedCashier.sumOutputs();
      openedCashier.status = 'finished';

      await openedCashier.save()
      view.share({
        successMessage: 'Caixa fechado com sucesso!'
      });
    }
    this.broadcastUpdateCashier();

    return response.route('cashier.index');
  }

  async index({view}) {
    let cashier = await Cashier.openedCashier();
    var transactions;
    if(cashier){
      transactions = await cashier.transactions().fetch();
      transactions = transactions.toJSON()
      cashier.total = await cashier.sumTotal();
      cashier.inputs = await cashier.sumInputs();
      cashier.outputs = await cashier.sumOutputs();
      cashier.sales = await cashier.sumSales();
      cashier.totalOrders = await cashier.countOrders();
    }
    let breadcrumb = [
      {
        name: "Caixa",
        url: '',
        icon: "fa-user",
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
      breadcrumb,
      cashier,
      transactions: transactions
    });
    return view.render("cashier.index");
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

  async transaction({request, response}) {
    const body = request.post();

    const openedCashier = await Cashier.openedCashier();
    if(!openedCashier)
      return response.status(401).json({error: true, message: "Não foi possível executar o pedido, pois o caixa está fechado!"});

    let transaction = new Transaction();
    transaction.value = body['value'];
    transaction.status = body['status'];
    transaction.cashier_id = openedCashier.id;
    let result = await transaction.save();
    this.broadcastUpdateCashier();
    return response.json(result);
  }


}

module.exports = CashierController
