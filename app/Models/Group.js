'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Group extends Model {

  products(){
    return this.$attributes.hasMany('App/Models/Product')
  }
  
}

module.exports = Group
