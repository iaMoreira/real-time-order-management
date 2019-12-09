let ws = null
let listProduction = $('#list_production_items')

$(function () {
  startChat()
})

function startChat () {
  ws = adonis.Ws().connect()

  ws.on('open', () => {
    subscribeToChannel()
  })

  ws.on('error', () => {
    console.log("erro")
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Há algo de errado na aplicação!',
      footer: '<a href>Tente reiniciar, caso persista ligue para o desenvolvedor.</a>'
    })
  })
}

function subscribeToChannel () {
  const chat = ws.subscribe('order')

  chat.on('error', () => {
    console.log("error")
  })

  chat.on('listOrders', function(orders){
    console.log(orders)
    $('#qtd_production').text(orders.production.length)
    listProduction.empty()
    for(order of orders.production){
      let items = "";
      for(item of order.items){
       items += `<li><a href="#">${item.product.name} <span class="pull-right badge bg-blue">${item.amount}</span></a></li>`             
      } 
      listProduction.append(`
        <div class="col-sm-4 col-md-4 col-lg-3 col-xl-2" style="min-height: 250px; height: 250px">
          <div class="box box-widget widget-user">
            <div class="widget-user-header bg-aqua" style="padding: 1px 20px;">
              <h3 class=""> <i class="fa fa-shopping-cart"></i> <b>Nº ${order.id}</b></h3>
              <h4 class=""> <i class="fa fa-user"></i>  ${order.client.name}</h4>
              <h6 class=""><i class="fa fa-clock-o"></i> ${moment(new Date(order.created_at)).format('HH:mm:ss DD-MM-YYYY')}</h6>
              
            </div>
            <div class="box-footer no-padding">
              <ul class="nav nav-stacked">
                ${items}
              </ul>
            </div>
          </div>
        </div>  
      `)
    }
  });
}
