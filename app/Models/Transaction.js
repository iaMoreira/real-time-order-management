'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require("moment");

class Transaction extends Model {

  type(){
    return this.belongsTo('App/Models/TransactionType')
  }

  order(){
    return this.belongsTo('App/Models/Order')
  }

  cashier(){
    return this.belongsTo('App/Models/Cashier')
  }
  static castDates(field, value) {
    if (field == "end_date") return value ? value.format("DD/MM/YYYY") : value;
    else return value ? value.format("HH:mm - DD/MM/YYYY") : value;
    // else used for created_at / updated_at
  }

  static formatDates(field, value) {
    if (field == "end_date")
      // format only certain fields
      return moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");

    return super.formatDates(field, value);
  }

}

module.exports = Transaction
