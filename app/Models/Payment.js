'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Payment extends Model {

  type(){
    return this.belongsTo('App/Models/PaymentType')
  }
  
  order(){
    return this.belongsTo('App/Models/Order')
  }

  cashRegister(){
    return this.belongsTo('App/Models/CashRegister')
  }

}

module.exports = Payment
