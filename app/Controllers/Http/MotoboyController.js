'use strict'
const Motoboy = use("App/Models/Motoboy");

class MotoboyController {

  async index({ route, request, response, session, view }) {
    let motoboys = await Motoboy.all()
    return view.render("motoboy.index", {
      motoboys: motoboys.toJSON()
    });
  }
}

module.exports = MotoboyController
