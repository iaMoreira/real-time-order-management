'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CashRegistersSchema extends Schema {
  up () {
    this.create('cashiers', (table) => {
      table.increments();
      table.enu('status', ['opened', 'closed']);
      table.decimal('total', 8, 2).nullable();
      table.decimal('inputs', 8, 2).nullable();
      table.decimal('outputs', 8, 2).nullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('cashiers')
  }
}

module.exports = CashRegistersSchema
