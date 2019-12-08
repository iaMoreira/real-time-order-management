"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Product extends Model {
  group() {
    return this.belongsTo("App/Models/Group");
  }

  orders() {
    return this.manyThrough("App/Models/Order", "items");
  }
}

module.exports = Product;
