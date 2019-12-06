'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CashRegistersSchema extends Schema {
  up () {
    this.create('cash_registers', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('cash_registers')
  }
}

module.exports = CashRegistersSchema
