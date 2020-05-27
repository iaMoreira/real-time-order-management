'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemsSchema extends Schema {
  up () {
    this.create('items', (table) => {
      table.increments()
      table.integer('order_id').notNullable().unsigned().references('id').inTable('orders')
      table.integer('product_id').notNullable().unsigned().references('id').inTable('products')
      table.decimal('discount', 8, 2);
      table.string('product_name');
      table.decimal('product_price', 8, 2);
      table.integer('quantity');
      table.decimal('amount', 8, 2).notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('items')
  }
}

module.exports = ItemsSchema
