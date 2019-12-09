'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MotoboysSchema extends Schema {
  up () {
    this.create('motoboys', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('phone').notNullable().unique()
      table.string('license_plate').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('motoboys')
  }
}

module.exports = MotoboysSchema
