'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MotoboysSchema extends Schema {
  up () {
    this.create('motoboys', (table) => {
      table.increments()
      table.string('name')
      table.string('phone')
      table.string('placa').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('motoboys')
  }
}

module.exports = MotoboysSchema
