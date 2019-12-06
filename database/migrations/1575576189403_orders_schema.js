'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrdersSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table.string('status')
      table.integer('client_id').unsigned().references('id').inTable('clients')
      table.integer('motoboy_id').unsigned().nullable().references('id').inTable('motoboys')

      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrdersSchema
