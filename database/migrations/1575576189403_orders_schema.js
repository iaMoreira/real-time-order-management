'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrdersSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table.string('status').notNullable()
      table.integer('client_id').notNullable().unsigned().references('id').inTable('clients')
      table.integer('cashier_id').notNullable().unsigned().references('id').inTable('cashiers')
      table.integer('motoboy_id').unsigned().nullable().references('id').inTable('motoboys')
      table.integer('payment_type_id').unsigned().nullable().references('id').inTable('payment_types')
      table.text('observation').nullable();
      table.decimal('amount', 8, 2)
      table.timestamp('canceled_at').nullable()
      table.timestamp('delivered_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrdersSchema
