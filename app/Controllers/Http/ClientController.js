'use strict'
const Client = use("App/Models/Client");

class ClientController {
  async index({ route, request, response, session, view }) {
    let clients = await Client.all()
    return view.render("client.index", {
      clients: clients.toJSON()
    });
  }
}

module.exports = ClientController
