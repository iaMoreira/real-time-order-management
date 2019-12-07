'use strict'

const Group = use("App/Models/Group");

class GroupController {
  async index({ route, request, response, session, view }) {
    let groups = await Group.all()
    return view.render("group.index", {
      groups: groups.toJSON()
    });
  }
}

module.exports = GroupController
