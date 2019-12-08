'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PaymentsSchema extends Schema {
  up () {
    this.create('payments', (table) => {
      table.increments()
      table.integer('payment_type_id').notNullable().unsigned().references('id').inTable('payment_types')
      table.integer('order_id').notNullable().unsigned().references('id').inTable('orders')
      table.integer('cash_register_id').unsigned().references('id').inTable('cash_registers')
      table.float('value', 2)
      table.float('discount', 2)
      table.string('status')
      table.timestamps()
    })
  }

  down () {
    this.drop('payments')
  }
}

module.exports = PaymentsSchema
