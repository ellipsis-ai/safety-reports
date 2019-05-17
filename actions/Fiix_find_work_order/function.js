function(workOrderId, ellipsis) {
  const workOrders = ellipsis.require('ellipsis-fiix@^0.1.0-beta').workOrders(ellipsis);

workOrders.findWorkOrder(workOrderId).then(res => {
  if (res[0]) {
    ellipsis.success(JSON.stringify(res[0]));
  }
});
}
