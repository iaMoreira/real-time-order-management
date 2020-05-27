let ws = null
let tableProduction = $('#table_production').DataTable();
let tableDelivery = $('#table_delivery').DataTable();
let tableDelivered = $('#table_delivered').DataTable();
let tableCanceled = $('#table_canceled').DataTable();

$(function () {
  // Only connect when username is available
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
    $('#qtd_delivery').text(orders.delivery.length)
    $('#qtd_delivered').text(orders.delivered.length)
    $('#qtd_canceled').text(orders.canceled.length)
    tableProduction.clear()
    tableDelivery.clear()
    tableDelivered.clear()
    tableCanceled.clear()
    for(order of orders.production){
      tableProduction.row.add( [
        order.id,
        order.client.name,
        localCurrency(order.amount),
        moment(new Date(order.created_at)).format('HH:mm:ss DD-MM-YYYY'),
        `<div style="text-align: center;">
            <a class="btn btn-primary" onclick="editProduction(${order.id}, '${order.client.name}')"><i class="fa fa-edit"></i></a>
            <a class="btn btn-danger" onclick="editCanceled(${order.id})" ><i class="fa fa-remove"></i></a>
        </div>`
      ] ).draw( false );
    }
    for(order of orders.delivery){
      tableDelivery.row.add( [
        order.id,
        order.client.name,
        localCurrency(order.amount),
        order.motoboy.name,
        moment(new Date(order.created_at)).format('HH:mm:ss DD-MM-YYYY'),
        `<div style="text-align: center;">
            <a class="btn btn-primary" onclick="editDelivery(${order.id}, '${order.motoboy.name}')"><i class="fa fa-edit"></i></a>
            <a class="btn btn-danger" onclick="editCanceled(${order.id})" ><i class="fa fa-remove"></i></a>
        </div>`
      ] ).draw( false );
    }
    for(order of orders.delivered){
      tableDelivered.row.add( [
        order.id,
        order.client.name,
        localCurrency(order.amount),
        order.motoboy.name,
        moment(new Date(order.created_at)).format('HH:mm:ss DD-MM-YYYY'),
        `<div style="text-align: center;">
            <a class="btn btn-danger" onclick="editCanceled(${order.id})" ><i class="fa fa-remove"></i></a>
        </div>`
      ] ).draw( false );
    }
    for(order of orders.canceled){
      tableCanceled.row.add( [
        order.id,
        order.client.name,
        localCurrency(order.amount),
        (order.motoboy ? order.motoboy.name : "Sem motoboy" ),
        moment(new Date(order.created_at)).format('HH:mm:ss DD-MM-YYYY')
      ] ).draw( false );
    }
  });
}

function localCurrency(value) {
  return (
    "R$ " +
    value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  );
}
