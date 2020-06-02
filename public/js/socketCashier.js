let ws = null
$('.alert').alert()
var table = $('#table').DataTable({
        'paging'      : true,
        'lengthChange': false,
        'searching'   : true,
        'ordering'    : true,
        'info'        : true,
        'autoWidth'   : false,
        "oLanguage": {
            "oPaginate":
            {
                "sFirst": "&lt&lt",
                "sLast": "&gt&gt",
                "sNext": "&gt",
                "sPrevious": "&lt"
            },
            "sEmptyTable": "Nenhum registro encontrado",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered": "(Filtrados de _MAX_ registros)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "_MENU_ Resultados por página",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Processando...",
            "sZeroRecords": "Nenhum registro encontrado",
            "sSearch": "Pesquisar ",

        }
    });

var tableCashiers = $('#tableCashiers').DataTable({
  'paging'      : true,
  'lengthChange': false,
  'searching'   : true,
  'ordering'    : true,
  'info'        : true,
  'autoWidth'   : false,
  "oLanguage": {
      "oPaginate":
      {
          "sFirst": "&lt&lt",
          "sLast": "&gt&gt",
          "sNext": "&gt",
          "sPrevious": "&lt"
      },
      "sEmptyTable": "Nenhum registro encontrado",
      "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
      "sInfoFiltered": "(Filtrados de _MAX_ registros)",
      "sInfoPostFix": "",
      "sInfoThousands": ".",
      "sLengthMenu": "_MENU_ Resultados por página",
      "sLoadingRecords": "Carregando...",
      "sProcessing": "Processando...",
      "sZeroRecords": "Nenhum registro encontrado",
      "sSearch": "Pesquisar ",

  }
});
$(function () {
  setupSocket()
})

function setupSocket () {
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
  const chat = ws.subscribe('cashier')

  chat.on('error', (error) => {
    console.log(error.message, error.topic)
  })

  chat.on('currentCashier', function(cashier){
    console.log(cashier)

    $('#total').text(localCurrency(cashier.total));
    $('#inputs').text(localCurrency(cashier.inputs));
    $('#outputs').text(localCurrency(cashier.outputs));
    $('#totalOrders').text(localCurrency(cashier.outputs));

    table.clear();
    for(transaction of cashier.transactions){
      table.row.add([
        transaction.id,
        localCurrency(transaction.value),
        transaction.status == 'input' ? 'Entrada' : 'Saída',
        transaction.created_at
      ]).draw();
    }

    if(cashier.cashiers){
      for(c of cashier.cashiers)
      tableCashiers.row.add([
        c.id,
        c.created_at,
        localCurrency(c.inputs),
        localCurrency(c.outputs),
        localCurrency(c.total),
        // c.sales,
        // c.totalOrders
      ]).draw();
    }
  });
}


function operation(title, status) {
  Swal.fire({
    title: title,
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    showLoaderOnConfirm: true,
    preConfirm: (value) => {
      return openTransaction( status, value);
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        title: 'Operação realizada com sucesso',
        icon: 'success'
      });
    }
  })

}

function openTransaction(status, value) {
  $.ajax({
    type: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    url: "cashier/transaction",
    data: JSON.stringify({status, value, _csrf: $("#token").val()}),
    success: function(obj) {
      return obj
    },
    error: (data) => {
      Swal.fire({
        title: 'Algo inesperado!',
        icon: 'error',
        text: data.responseJSON.message
      });
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

$("#production").click(() => {
  $("#tab_production").addClass(["active", "show"]);
  $("#tab_delivery").removeClass(["active", "show"]);
  $("#tab_delivered").removeClass(["active", "show"]);
  $("#tab_canceled").removeClass(["active", "show"]);
});

$("#delivery").click(() => {
  $("#tab_production").removeClass(["active", "show"]);
  $("#tab_delivery").addClass(["active", "show"]);
  $("#tab_delivered").removeClass(["active", "show"]);
  $("#tab_canceled").removeClass(["active", "show"]);
});
