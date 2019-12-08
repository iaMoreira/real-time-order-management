"use strict";
const Client = use("App/Models/Client");

class ClientController {
  async index({ route, request, response, session, view }) {
    let clients = await Client.all();
    return view.render("client.index", {
      clients: clients.toJSON()
    });
  }

  async getDataClient({ request, response }) {
    const { phone } = request.get();
    let client = await Client.query()
      .with('address')
      .where("phone", phone)
      .first();
    
      if (client) {
      return response.json(client);
    } else {
      return response.status(204).json(false);
    }
  }
}

module.exports = ClientController;
