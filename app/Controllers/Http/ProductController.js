"use strict";
const Product = use("App/Models/Product");
const Group = use("App/Models/Group");

class ProductController {
  
  
  async index({ route, request, response, session, view }) {
    let products = await Product.query()
      .with("group")
      .fetch();
    return view.render("product.index", {
      products: products.toJSON()
    });
  }

  async create({ route, request, response, session, view }) {
    let groups = await Group.all();
    return view.render("product.create", {
      groups: groups.rows
    });
  }

  async store({ route, request, response, session, view }) {
    const all = request.all();
    let product = await Product.create(all);

    return view.render("product.create", {
      groups: groups.rows
    });
  }
}

module.exports = ProductController;
