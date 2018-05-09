function(workOrderId, ellipsis) {
  const workOrders = require('fiix-work-orders')(ellipsis);

workOrders.findWorkOrder(workOrderId).then(res => {
  if (res[0]) {
    ellipsis.success(JSON.stringify(res[0]));
  }
});
}
