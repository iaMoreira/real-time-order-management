'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {

  client(){
    return this.belongsTo('App/Models/Client')
  }
  
  motoboy(){
    return this.belongsTo('App/Models/Motoboy')
  }

  payment(){
    return this.hasOne('App/Models/Payment')
  }

  products () {
    return this.manyThrough('App/Models/Producs', 'items')
  }
}

module.exports = Order
