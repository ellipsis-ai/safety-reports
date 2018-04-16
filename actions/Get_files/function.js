function(ellipsis) {
  const client = require('fiix-sdk')(ellipsis);
const workOrders = require('work-orders')(ellipsis);

workOrders.maintenanceTypeId().then(typeId => {
  client.find({
    className: "WorkOrder",
    fields: "id",
    filters: [{ "ql": "intMaintenanceTypeID = ?", "parameters": [typeId] }],
    callback: function(ret) {
      if (!ret.error) {
        const workOrderIds = ret.objects.map(ea => ea.id);
        client.find({
          className: "File",
          fields: "id, strName, intFileTypeID",
          filters: [{ "ql": "intWorkOrderID = ?", "parameters": [workOrderIds[0]] }],
          callback: function(ret) {
            if (!ret.error) {
              ellipsis.success(JSON.stringify(ret.objects));
            } else {
              ellipsis.error(JSON.stringify(ret.error));
            }
          }
        })
      }
    }
  })
});
}
