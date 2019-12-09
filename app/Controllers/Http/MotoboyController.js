'use strict'
const Motoboy = use("App/Models/Motoboy");

class MotoboyController {

  async index({ view }) {
    let motoboys = await Motoboy.all()
    return view.render("motoboy.index", {
      motoboys: motoboys.toJSON()
    });
  }

  async create({ view }) {
    return view.render("motoboy.create");
  }

  async store({ request, response }) {
    const all = request.except("_csrf");
    let motoboy = await Motoboy.create(all);

    return response.redirect("/motoboys");
  }

  async edit({ view, params }) {
    let motoboy = await Motoboy.findOrFail(params.id);
    return view.render("motoboy.create", {
      motoboy: motoboy
    });
  }

  async update({ request, response, params }) {
    const { name, phone, license_plate } = request.except(["_csrf", "_method"]);
    const motoboy = await Motoboy.findOrFail(params.id);
    motoboy.name = name;
    motoboy.phone = phone;
    motoboy.license_plate = license_plate;
    const result = await motoboy.save();
    if (result) {
    }
    return response.route("motoboys.index");
  }

  async destroy({ response, params }) {
    const motoboy = await Motoboy.findOrFail(params.id);
    const result = await motoboy.delete();
    if (result) {
    }
    return response.json(true);
  }
}

module.exports = MotoboyController
