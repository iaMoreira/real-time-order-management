'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddressesSchema extends Schema {
  up () {
    this.create('addresses', (table) => {
      table.increments()
      table.integer('client_id').notNullable().unsigned().references('id').inTable('clients')
      table.string('address').notNullable()
      table.string('number').notNullable()
      table.string('complement').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('addresses')
  }
}

module.exports = AddressesSchema
