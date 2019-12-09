var motoboy_id;
var order_id;
$("#table_production").DataTable({
  paging: true,
  lengthChange: true,
  columns: [
    { width: "5%" },
    null,
    { width: "15%" },
    { width: "15%" },
    { width: "15%" }
  ],
  lengthMenu: [
    [10, 25, 50, -1],
    [10, 25, 50, "Tudo"]
  ],
  searching: true,
  ordering: true,
  info: true,
  autoWidth: false,
  oLanguage: {
    oPaginate: {
      sFirst: "&lt&lt",
      sLast: "&gt&gt",
      sNext: "&gt",
      sPrevious: "&lt"
    },
    sEmptyTable: "Nenhum registro encontrado",
    sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
    sInfoEmpty: "Mostrando 0 até 0 de 0 registros",
    sInfoFiltered: "(Filtrados de _MAX_ registros)",
    sInfoPostFix: "",
    sInfoThousands: ".",
    sLengthMenu: "_MENU_ Resultados por página",
    sLoadingRecords: "Carregando...",
    sProcessing: "Processando...",
    sZeroRecords: "Nenhum registro encontrado",
    sSearch: "Pesquisar "
  }
});

$("#table_delivery").DataTable({
  paging: true,
  lengthChange: true,
  columns: [
    { width: "5%" },
    null,
    { width: "15%" },
    { width: "15%" },
    { width: "15%" },
    { width: "15%" }
  ],
  searching: true,
  ordering: true,
  info: true,
  autoWidth: false,
  oLanguage: {
    oPaginate: {
      sFirst: "&lt&lt",
      sLast: "&gt&gt",
      sNext: "&gt",
      sPrevious: "&lt"
    },
    sEmptyTable: "Nenhum registro encontrado",
    sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
    sInfoEmpty: "Mostrando 0 até 0 de 0 registros",
    sInfoFiltered: "(Filtrados de _MAX_ registros)",
    sInfoPostFix: "",
    sInfoThousands: ".",
    sLengthMenu: "_MENU_ Resultados por página",
    sLoadingRecords: "Carregando...",
    sProcessing: "Processando...",
    sZeroRecords: "Nenhum registro encontrado",
    sSearch: "Pesquisar "
  }
});

$("#table_delivered").DataTable({
  paging: true,
  lengthChange: true,
  columns: [
    { width: "5%" },
    null,
    { width: "15%" },
    { width: "15%" },
    { width: "15%" },
    { width: "15%" }
  ],
  searching: true,
  ordering: true,
  info: true,
  autoWidth: false,

  oLanguage: {
    oPaginate: {
      sFirst: "&lt&lt",
      sLast: "&gt&gt",
      sNext: "&gt",
      sPrevious: "&lt"
    },
    sEmptyTable: "Nenhum registro encontrado",
    sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
    sInfoEmpty: "Mostrando 0 até 0 de 0 registros",
    sInfoFiltered: "(Filtrados de _MAX_ registros)",
    sInfoPostFix: "",
    sInfoThousands: ".",
    sLengthMenu: "_MENU_ Resultados por página",
    sLoadingRecords: "Carregando...",
    sProcessing: "Processando...",
    sZeroRecords: "Nenhum registro encontrado",
    sSearch: "Pesquisar "
  }
});

$("#table_canceled").DataTable({
  paging: true,
  lengthChange: true,
  columns: [
    { width: "5%" },
    null,
    { width: "15%" },
    { width: "15%" },
    { width: "15%", style: "text-align: center;" }
  ],
  searching: true,
  ordering: true,
  info: true,
  autoWidth: false,
  oLanguage: {
    oPaginate: {
      sFirst: "&lt&lt",
      sLast: "&gt&gt",
      sNext: "&gt",
      sPrevious: "&lt"
    },
    sEmptyTable: "Nenhum registro encontrado",
    sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
    sInfoEmpty: "Mostrando 0 até 0 de 0 registros",
    sInfoFiltered: "(Filtrados de _MAX_ registros)",
    sInfoPostFix: "",
    sInfoThousands: ".",
    sLengthMenu: "_MENU_ Resultados por página",
    sLoadingRecords: "Carregando...",
    sProcessing: "Processando...",
    sZeroRecords: "Nenhum registro encontrado",
    sSearch: "Pesquisar "
  }
});

function editProduction(id, name) {
  order_id = id;
  $("#production_order_id").val(id);
  $("#production_order_name").val(name);
  $("#exampleModal").modal("show");
}

function editDelivery(id, name) {
  order_id = id;
  $("#delivery_order_id").val(id);
  $("#delivery_order_mobotoy").val(name);
  $("#deliveryModal").modal("show");
}

function editCanceled(id) {
  order_id = id;
  Swal.fire({
    title: "Atenção!",
    text: "Você tem certeza que quer cancelar o pedido: " + id,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelmButtonText: "Não",
    confirmButtonText: "Sim, quero cancelar!"
  }).then(result => {
    if (result.value) {
      submitCanceled();
    }
  });
}

function submitDelivery() {
  var method = "PATCH";
  var token = "{{ csrfToken }}";
  var motoboy_id = $("#motoboy_id").val();
  $.ajax({
    type: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    url: "orders/" + order_id + "?_method=PATCH",
    data: JSON.stringify({
      _token: token,
      status: "delivery",
      motoboy_id: motoboy_id
    }),
    success: function(obj) {
      $("#exampleModal").modal("hide");
    }
  });
}

function submitDelivered() {
  var method = "PATCH";
  var token = "{{ csrfToken }}";
  var motoboy_id = $("#motoboy_id").val();
  $.ajax({
    type: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    url: "orders/" + order_id + "?_method=PATCH",
    data: JSON.stringify({
      _token: token,
      status: "delivered",
      motoboy_id: motoboy_id
    }),
    success: function(obj) {
      $("#deliveryModal").modal("hide");
    }
  });
}

function submitCanceled() {
  var token = "{{ csrfToken }}";
  $.ajax({
    type: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    url: "orders/" + order_id + "?_method=PATCH",
    data: JSON.stringify({
      _token: token,
      status: "canceled"
    }),
    success: function(obj) {
      Swal.fire("Cancelado!", `O pedido ${order_id} foi cancelado`, "success");
    }
  });
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

$("#delivered").click(() => {
  $("#tab_production").removeClass(["active", "show"]);
  $("#tab_delivery").removeClass(["active", "show"]);
  $("#tab_delivered").addClass(["active", "show"]);
  $("#tab_canceled").removeClass(["active", "show"]);
});

$("#canceled").click(() => {
  $("#tab_production").removeClass(["active", "show"]);
  $("#tab_delivery").removeClass(["active", "show"]);
  $("#tab_delivered").removeClass(["active", "show"]);
  $("#tab_canceled").addClass(["active", "show"]);
});
