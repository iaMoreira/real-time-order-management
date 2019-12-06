let ws = null
var tableProduction = $('#table_production').DataTable();
var tableLeftDelivery = $('#table_left_delivery').DataTable();

$(function () {
  // Only connect when username is available
  if (window.username) {
    startChat()
  }
})

function startChat () {
  ws = adonis.Ws().connect()

  ws.on('open', () => {
    $('.connection-status').addClass('connected')
    subscribeToChannel()
  })

  ws.on('error', () => {
    $('.connection-status').removeClass('connected')
  })
}

function subscribeToChannel () {
  const chat = ws.subscribe('order')

  chat.on('error', () => {
    $('.connection-status').removeClass('connected')
  })
  chat.on('production', (order) => {
    tableProduction.row.add( [
      order.id,
      order.name,
      order.price,
      order.created_at,
      `<div> 
          <a class="btn btn-primary"><i class="fa fa-edit"></i></a>
          <a class="btn btn-danger" ><i class="fa fa-trash"></i></a>
      </div>`
    ] ).draw( false );
  })

  chat.on('left_delivery', (order) => {
    tableLeftDelivery.row.add( [
      order.id,
      order.name,
      order.price,
      order.created_at,
      `<div> 
          <a class="btn btn-primary"><i class="fa fa-edit"></i></a>
          <a class="btn btn-danger" ><i class="fa fa-trash"></i></a>
      </div>`
    ] ).draw( false );
  })
}

function next() {

    const message = $(this).val()
    $(this).val('')

    ws.getSubscription('order').emit('left_delivery', {
      order: row  
    })
}