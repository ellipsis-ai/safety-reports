function(workOrderId, ellipsis) {
  const workOrders = require('ellipsis-fiix').workOrders(ellipsis);

workOrders.findWorkOrder(workOrderId).then(res => {
  if (res[0]) {
    ellipsis.success(JSON.stringify(res[0]));
  }
});
}
