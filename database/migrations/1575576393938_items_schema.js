'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemsSchema extends Schema {
  up () {
    this.create('items', (table) => {
      table.increments()
      table.integer('order_id').unsigned().references('id').inTable('orders')
      table.integer('product_id').unsigned().references('id').inTable('products')
      table.integer('amount').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('items')
  }
}

module.exports = ItemsSchema
