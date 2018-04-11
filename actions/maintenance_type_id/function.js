function(ellipsis) {
  const workOrders = require('work-orders')(ellipsis);

workOrders.maintenanceTypeId().then(id => {
  ellipsis.success(`The ID is ${id}`);
})
}
