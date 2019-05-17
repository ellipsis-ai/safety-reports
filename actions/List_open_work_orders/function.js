function(ellipsis) {
  const workOrders = ellipsis.require('ellipsis-fiix@^0.1.0').workOrders(ellipsis);

function workOrderTitle(wo, index) {
  return `${index + 1}. Work order ${wo.strCode}`;
}

workOrders.getOpen().then((workOrders) => {
  if (workOrders.length === 0) {
    ellipsis.success("There are no open work orders at this moment. 🎉");
    return;
  }
  const workOrderSummary = workOrders.map((wo, index) => {
    const woTitle = workOrderTitle(wo, index);
    const maintenanceType = wo.extraFields.dv_intMaintenanceTypeID || "";
    const siteID = wo.extraFields.dv_intSiteID || "";
    const details = [woTitle, maintenanceType, siteID]
      .map((ea) => ea.trim())
      .filter((ea) => Boolean(ea))
      .join(" · ");
    const description = wo.strDescription ? `> ${wo.strDescription.trim().replace(/\n/g, "\n> ")}\n` : "";
    const tasks = wo.tasks
      .map((task) => task.strDescription)
      .filter((ea) => Boolean(ea));
    const taskSummary = tasks.length > 0 ? `> _Tasks:_\n${tasks.map((ea, index) => `> • ${ea.replace(/\n/g, "\n> ")}`).join("\n")}` : "";
    return `**${details.trim()}**
${description}${taskSummary}
`
  }).join("\n\n");
  const intro = workOrders.length === 1 ? "There is one open work order." :
    `There are ${workOrders.length} open work orders.`;
  const result = `
${intro}

${workOrderSummary}

**Select a work order to mark it completed.**
`;
  ellipsis.success(result, {
    choices: workOrders.map((wo, index) => {
      return {
        actionName: "Complete work order with tasks",
        label: workOrderTitle(wo, index),
        args: [{
          name: "workOrderId",
          value: String(wo.id)
        }],
        allowOthers: true,
        allowMultipleSelections: true
      };
    })
  });
});
}
