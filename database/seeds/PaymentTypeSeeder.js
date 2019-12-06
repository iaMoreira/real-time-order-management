'use strict'

/*
|--------------------------------------------------------------------------
| PaymentTypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const PaymentType = use('App/Models/PaymentType')
class PaymentTypeSeeder {
  async run () {
    const groups = await Group.createMany([
      {
        name: 'Dinheiro', 
      },
      {
        name: 'Débito', 
      },
      {
        name: 'Crédito', 
      }

    ])
  }
}

module.exports = PaymentTypeSeeder
