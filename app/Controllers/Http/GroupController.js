"use strict";

const Group = use("App/Models/Group");

class GroupController {
  async index({ view }) {
    let groups = await Group.all();
    return view.render("group.index", {
      groups: groups.toJSON()
    });
  }

  async create({ view }) {
    return view.render("group.create");
  }

  async store({ request, response }) {
    const all = request.except("_csrf");
    let group = await Group.create(all);

    return response.redirect("/groups");
  }

  async edit({ view, params }) {
    let group = await Group.findOrFail(params.id);
    return view.render("group.create", {
      group: group
    });
  }

  async update({ request, response, params }) {
    const { name } = request.except(["_csrf", "_method"]);
    const group = await Group.findOrFail(params.id);
    group.name = name;
    const result = await group.save();
    if (result) {
    }
    return response.route("groups.index");
  }

  async destroy({ response, params }) {
    const group = await Group.findOrFail(params.id);
    const result = await group.delete();
    if (result) {
    }
    return response.json(true);
  }
}

module.exports = GroupController;
