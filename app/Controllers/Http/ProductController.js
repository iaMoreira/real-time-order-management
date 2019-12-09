"use strict";
const Product = use("App/Models/Product");
const Group = use("App/Models/Group");

class ProductController {
  
  
  async index({ view }) {
    let products = await Product.query()
      .with("group")
      .fetch();
    return view.render("product.index", {
      products: products.toJSON()
    });
  }

  async create({ view }) {
    let groups = await Group.all();
    return view.render("product.create", {
      groups: groups.rows
    });
  }

  async store({ request, response }) {
    const all = request.except('_csrf');
    all['price'] = all['price'].replace('.','').replace(',','.')
    let product = await Product.create(all);

    return response.redirect('/products')
  }

  async edit({ view, params }) {
    let groups = await Group.all();
    let product = await Product.findOrFail(params.id);
    return view.render("product.create", {
      groups: groups.rows,
      product: product
    });
  }

  async update({ request, response, params }) {
    const {name, price, group_id} = request.except(['_csrf', '_method']);
    const product = await Product.findOrFail(params.id);
    product.price = price.replace('.','').replace(',','.');
    product.name = name;
    product.group_id = group_id;
    const result = await product.save();
    if (result) {
    }
    return response.route('products.index')
  }

  async destroy({response, params}){
    const product = await Product.findOrFail(params.id);
    const result = await product.delete();
    if (result) {
    }
    return response.json(true)
  }
}

module.exports = ProductController;
