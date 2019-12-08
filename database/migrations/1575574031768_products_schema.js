'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductsSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('description').nullable()
      table.float('price').notNullable()
      table.integer('group_id').notNullable().unsigned().references('id').inTable('groups')
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductsSchema
