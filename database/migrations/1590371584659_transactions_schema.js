'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionsSchema extends Schema {
  up () {
    this.create('transactions', (table) => {
      table.increments();
      table.integer('cashier_id').notNullable().unsigned().references('id').inTable('cashiers');
      table.integer('order_id').nullable().unsigned().references('id').inTable('orders');
      table.integer('payment_type_id').nullable().unsigned().references('id').inTable('payment_types');
      table.enu('status', ['input', 'output']);
      table.decimal('value', 8, 2);
      table.timestamps();
    })
  }

  down () {
    this.drop('transactions')
  }
}

module.exports = TransactionsSchema
