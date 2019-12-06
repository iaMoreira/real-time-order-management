'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Item extends Model {

  order(){
    return this.belongsTo('App/Models/Order')
  }

  product(){
    return this.belongsTo('App/Models/Product')
  }
}

module.exports = Item
