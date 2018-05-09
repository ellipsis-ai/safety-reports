/*
@exportId Foidt4deRumQi_D4WhzVTw
*/
module.exports = (function() {
return ellipsis => {
  const client = require('fiix-sdk')(ellipsis);
  const maintenanceTypeName = ellipsis.env.FIIX_SAFETY_TYPE_NAME;
  const guestUserId = parseInt(ellipsis.env.FIIX_GUEST_USER_ID);

  return {
    create: createWorkOrder,
    maintenanceTypeId: maintenanceTypeId,
    findWorkOrder: findWorkOrder
  };
  
  function createWorkOrder(description, location, reporterName) {
    return new Promise((resolve, reject) => {
      createBareWorkOrder(description, location, reporterName).then(workOrderId => {
        createWorkOrderLocation(workOrderId, location).then(() => {
          resolve(workOrderId);
        });
      });
    });
  }
  
  function maintenanceTypeId() {
    return new Promise((resolve, reject) => {
      client.find({
        "className": "MaintenanceType",
        "fields": "id",
        "filters": [{ "ql": "strName = ?", "parameters": [maintenanceTypeName] }],
        "maxObjects": 1,
        "callback": function(ret) {
          if (!ret.error) {
            const found = ret.objects[0];
            resolve(found ? found.id : undefined);
          } else reject(ret.error);
        }
      });
    });
  }
  
  function openStatusId() {
    return new Promise((resolve, reject) => {
      client.find({
        "className": "WorkOrderStatus",
        "fields": "id",
        "filters": [{ "ql": "strName = ?", "parameters": ["Open"] }],
        "maxObjects": 1,
        "callback": function(ret) {
          if (!ret.error) {
            const found = ret.objects[0];
            resolve(found ? found.id : undefined);
          } else reject(ret.error);
        }
      });
    });
  }
  
  function requestedStatusId() {
    return new Promise((resolve, reject) => {
      client.find({
        "className": "WorkOrderStatus",
        "fields": "id",
        "filters": [{ "ql": "strName = ?", "parameters": ["Requested"] }],
        "maxObjects": 1,
        "callback": function(ret) {
          if (!ret.error) {
            const found = ret.objects[0];
            resolve(found ? found.id : undefined);
          } else reject(ret.error);
        }
      });
    });
  }
  
  function lowPriorityId() {
    return new Promise((resolve, reject) => {
      client.find({
        "className": "Priority",
        "fields": "id",
        "filters": [{ "ql": "strName = ?", "parameters": ["Low"] }],
        "maxObjects": 1,
        "callback": function(ret) {
          if (!ret.error) {
            const found = ret.objects[0];
            resolve(found ? found.id : undefined);
          } else reject(ret.error);
        }
      });
    });
  }
    
  function createBareWorkOrder(description, location, reporterName) {
    return new Promise((resolve, reject) => {
      maintenanceTypeId().then(maintenanceTypeId => {
        requestedStatusId().then(requestedStatusId => {
          lowPriorityId().then(lowPriorityId => {
            client.add({
              "className" : "WorkOrder",
              "fields": "id",
              "object" : {
                "intRequestedByUserID": guestUserId,
                "intMaintenanceTypeID" : maintenanceTypeId,
                "intPriorityID": lowPriorityId,
                "intWorkOrderStatusID" : requestedStatusId,
                "intSiteID": parseInt(location.siteId),
                "strDescription" : description,
                "strNameUserGuest" : "some guy",
                "strEmailUserGuest" : "andrew@ellipsis.ai",
                "strPhoneUserGuest" : "647-123-4567"
              },
              "callback": function(ret) {
                if (!ret.error) {
                  resolve(ret.object.id);
                } else reject(JSON.stringify(ret.error));
              }
            });
          });
        });
      });
    });
  }
  
  function createWorkOrderLocation(workOrderId, location) {
    return new Promise((resolve, reject) => {
      client.add({
        "className" : "WorkOrderAsset",
        "fields": "id",
        "object" : {
          "intWorkOrderID" : workOrderId,
          "intAssetID" : parseInt(location.id)
        },
        "callback": function(ret) {
          if (!ret.error) {
            resolve(ret.object.id);
          } else reject(JSON.stringify(ret.error));
        }
      });
    });
  }
  
  function findWorkOrder(workOrderId) {
    return new Promise((resolve, reject) => {
      client.find({
        className: "WorkOrder",
        fields: "id, strDescription, strNameUserGuest, strEmailUserGuest, strPhoneUserGuest, intRequestedByUserID",
        "filters": [{ "ql": "id = ?", "parameters": [workOrderId] }],
        "callback": function(ret) {
          if (!ret.error) {
            resolve(ret.objects);
          } else {
            reject(ret.error);
          }
        }
      });
    });
  }

};
})()
     