function(workOrderId, ellipsis) {
  const ellipsisFiix = ellipsis.require('ellipsis-fiix@^0.1.0-beta');
const workOrders = ellipsisFiix.workOrders(ellipsis);

workOrders.getCompletedStatusId().then((completedID) => {
  workOrders.find(workOrderId).then((wo) => {
    if (!wo || wo.intWorkOrderStatusID === completedID) {
      ellipsis.success("This work order was already marked complete.")
    } else {
      return beginWorkOrderCompletion(wo);
    }
  });
});

function beginWorkOrderCompletion(wo) {
  return workOrders.getTasksFor(workOrderId).then((tasks) => {
    const firstTask = tasks[0];
    const woTitle = `**Work order ${wo.strCode}**`;
    const maintenanceType = wo.extraFields.dv_intMaintenanceTypeID || "";
    const siteID = wo.extraFields.dv_intSiteID || "";
    const details = [woTitle, maintenanceType, siteID]
      .map((ea) => ea.trim())
      .filter((ea) => Boolean(ea))
      .join(" · ");
    const taskIntro = tasks.length === 1 ?
      "There is one task in this work order." : `There are ${tasks.length} tasks in this work order.`;
    const firstTaskDescription = tasks.length === 1 ? (firstTask.strDescription || "") : 
      `Task 1: ${firstTask.strDescription || "(no description available)"}`;
    ellipsis.success(`
${woTitle}

_Description:_ ${wo.strDescription || "(none)"}

${taskIntro}

${firstTaskDescription}
  `, {
      next: {
        actionName: "Complete work order task",
        args: [{
          name: "taskId",
          value: String(firstTask.id)
        }, {
          name: "taskNumber",
          value: "1"
        }, {
          name: "remainingTaskData",
          value: JSON.stringify(tasks.slice(1))
        }]
      }
    });
  });
}
}
