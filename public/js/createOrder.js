$("#table_items").dataTable({
  "sPaginationType": "full_numbers",
  "bPaginate": false,
  "bServerSide": false, 
  "bLengthChange": false,
  "bFilter": false,
  "bSort": false,
  "bInfo": false,
  "bAutoWidth": true,
  
  "oLanguage": 
  {
      "oPaginate": 
      {
          "sFirst": "&lt&lt",
          "sLast": "&gt&gt",
          "sNext": "&gt",
          "sPrevious": "&lt"
      },
      "sZeroRecords": "NENHUM ITEM ADICIONADO.",
      "sInfo": "Mostrando de _START_ a _END_ de um total de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando de 0 a 0 de 0 registros",
      "sInfoFiltered": "(total de _MAX_ registros)",
      "sSearch": "Busca: "
  }
});

let tableItems = $("#table_items").DataTable();
let amountItem = $("#amount_item");
let paymentTypeId = $('#payment_type_id');
let discount = $('#discount');
let client_id = $('#client_id');
let name = $('#name');
let phone = $('#phone');
let address = $('#address');
let number = $('#number');
let complement = $('#complement');
let observation = $('#observation');
let id_itens = 0;
let token = $('#token')

function addItem(id, name, price) {
  let amount = amountItem.val();

  id_itens++;
  tableItems.row
    .add([
      id,
      name,
      localCurrency(price),
      amount,
      localCurrency(price * amount),
      `<div class="text-center"><a class="btn btn-danger" onclick="removeItem(this)" ><i class="fa fa-remove"></i></a></div>`
    ])
    .draw(false);

  amountItem.val("1");
}
function removeItem(row) {
  // var confir = confirm("Tem certeza que deseja excluir?");
  Swal.fire({
    title: "Um item será deletado!",
    text: "Você tem certeza que deseja deletar esse item!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim"
  }).then(result => {
    if (result.value) {
      tableItems
        .row(row.parentElement.parentElement.parentElement)
        .remove()
        .draw(false);
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

function submit() {
  var form = new FormData();
  
  let items = tableItems
    .rows()
    .data()
    .toArray()
    .map(function(item) {
      return {product_id: item[0], amount: item[3]};
    });
  let data =  JSON.stringify({
    _csrf: token.val(),
    items: items,
    payment_type_id: paymentTypeId.val(),
    discount: discount.val(),
    client_id: client_id.val(),
    name: name.val(),
    phone: phone.val(),
    address: address.val(),
    number: number.val(),
    complement: complement.val(),
    observation: observation.val(),
    _csrf: token.val(),
  });

  $.ajax({
    type: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    url: "/orders",
    data: data,
    success: function(obj) {
      window.location.href = "/"
    }
  });
}

async function getDataClient(){
  $.ajax({
    'processing': true,
    type: "GET",
    data: {phone: $("#phone").val()},
    url: '/client/phone',
    success: function (client) {                
      if (client) {
        console.log(client)
        client_id.val(client.id)
        name.val(client.name)
        number.val(client.address.number)
        address.val(client.address.address)
        complement.val(client.address.complement)
      } 
    }
  });
}