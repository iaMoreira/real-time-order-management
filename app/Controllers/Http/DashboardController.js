"use strict";
const Motoboy = use("App/Models/Motoboy");
const Route = use('Route');
class DashboardController {
  async index({ request, response, view }) {
    let motoboys = await Motoboy.all();
    let breadcrumb = [{
      name: 'Home',
      url: Route.url('/'),
      icon: 'fa-dashboard',
      class: '',
      content: ''
    },
    {
      name: 'Pedidos',
      url: 'javascript:void(0)',
      icon: '',
      class: 'active',
      content: '<span>dffd</span>'
    }
  ];
  view.share({
    title: 'Pedidos',
    breadcrumb: breadcrumb

  });
    return view.render("dashboard.index", {motoboys: motoboys.rows});
  }
}

module.exports = DashboardController;
