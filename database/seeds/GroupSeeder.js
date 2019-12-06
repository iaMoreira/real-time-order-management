'use strict'

/*
|--------------------------------------------------------------------------
| GroupSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Group = use('App/Models/Group')

class GroupSeeder {
  async run () {
    const groups = await Group.createMany([
      {
        name: 'Comidas', 
      },
      {
        name: 'Bebidas', 
      }
    ])
  }
}

module.exports = GroupSeeder
