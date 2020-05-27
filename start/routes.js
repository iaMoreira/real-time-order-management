'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'DashboardController.index').as('dashboard')
Route.resource('orders', 'OrderController')
Route.resource('products', 'ProductController')
Route.resource('groups', 'GroupController')
Route.resource('clients', 'ClientController')
Route.resource('motoboys', 'MotoboyController')
Route.get('client/phone', 'ClientController.getDataClient')
Route.get('cashier', 'CashierController.index').as('cashier.index')
Route.get('cashier/open', 'CashierController.open').as('cashier.open')
Route.get('cashier/close', 'CashierController.close').as('cashier.close')
Route.post('cashier/transaction', 'CashierController.transaction').as('cashier.transaction')
